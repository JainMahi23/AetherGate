package com.aethergate.gateway.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final PasswordEncoder passwordEncoder;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    /**
     * Generates a cryptographically random 6-digit OTP.
     */
    public String generateOtp() {
        int otp = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Hashes the OTP using BCrypt (same encoder used for passwords).
     * The plain-text OTP is never stored.
     */
    public String hashOtp(String otp) {
        return passwordEncoder.encode(otp);
    }

    /**
     * Verifies a plain-text OTP against its BCrypt hash.
     */
    public boolean verifyOtp(String rawOtp, String hashedOtp) {
        return passwordEncoder.matches(rawOtp, hashedOtp);
    }
}
