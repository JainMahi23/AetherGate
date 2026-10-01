package com.aethergate.gateway.auth.service.impl;

import com.aethergate.gateway.auth.dto.AuthResponse;
import com.aethergate.gateway.auth.dto.LoginRequest;
import com.aethergate.gateway.auth.dto.RegisterRequest;
import com.aethergate.gateway.auth.dto.ResendOtpRequest;
import com.aethergate.gateway.auth.dto.VerifyOtpRequest;
import com.aethergate.gateway.auth.entity.User;
import com.aethergate.gateway.auth.exception.InvalidCredentialsException;
import com.aethergate.gateway.auth.exception.UserAlreadyExistsException;
import com.aethergate.gateway.auth.mapper.UserMapper;
import com.aethergate.gateway.auth.repository.UserRepository;
import com.aethergate.gateway.auth.service.AuthService;
import com.aethergate.gateway.auth.service.EmailService;
import com.aethergate.gateway.auth.service.OtpService;
import com.aethergate.gateway.enums.Role;
import com.aethergate.gateway.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int OTP_RESEND_COOLDOWN_SECONDS = 60;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "User already exists with email: " + request.getEmail()
            );
        }

        User user = UserMapper.toEntity(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);
        user.setEmailVerified(false);

        // Generate and send OTP
        String otp = otpService.generateOtp();
        user.setOtpHash(otpService.hashOtp(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        user.setOtpResendAfter(LocalDateTime.now().plusSeconds(OTP_RESEND_COOLDOWN_SECONDS));

        userRepository.save(user);

        // Send OTP email (plain-text OTP is only passed to the email service, never persisted)
        emailService.sendOtpEmail(user.getEmail(), otp);

        // Return empty token — user must verify OTP before getting a JWT
        return AuthResponse.builder()
                .accessToken(null)
                .tokenType("Bearer")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password."));

        // Block login if email is not verified
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new InvalidCredentialsException(
                    "Email not verified. Please check your inbox for the verification code.");
        }

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        java.util.List.of(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                        user.getRole().name()
                                )
                        )
                )
        );

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .build();
    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or verification code."));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new InvalidCredentialsException("Email is already verified.");
        }

        if (user.getOtpHash() == null || user.getOtpExpiry() == null) {
            throw new InvalidCredentialsException("No verification code found. Please request a new one.");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new InvalidCredentialsException("Verification code has expired. Please request a new one.");
        }

        if (!otpService.verifyOtp(request.getOtp(), user.getOtpHash())) {
            throw new InvalidCredentialsException("Invalid verification code.");
        }

        // Mark email as verified and clear OTP data (single-use)
        user.setEmailVerified(true);
        user.setOtpHash(null);
        user.setOtpExpiry(null);
        user.setOtpResendAfter(null);

        userRepository.save(user);
    }

    @Override
    public void resendOtp(ResendOtpRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("No account found with this email."));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new InvalidCredentialsException("Email is already verified.");
        }

        // Enforce cooldown
        if (user.getOtpResendAfter() != null && LocalDateTime.now().isBefore(user.getOtpResendAfter())) {
            throw new InvalidCredentialsException("Please wait before requesting a new code.");
        }

        // Generate new OTP
        String otp = otpService.generateOtp();
        user.setOtpHash(otpService.hashOtp(otp));
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        user.setOtpResendAfter(LocalDateTime.now().plusSeconds(OTP_RESEND_COOLDOWN_SECONDS));

        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }
}