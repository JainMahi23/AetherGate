package com.aethergate.gateway.auth.controller;

import com.aethergate.gateway.auth.dto.AuthResponse;
import com.aethergate.gateway.auth.dto.LoginRequest;
import com.aethergate.gateway.auth.dto.RegisterRequest;
import com.aethergate.gateway.auth.dto.ResendOtpRequest;
import com.aethergate.gateway.auth.dto.VerifyOtpRequest;
import com.aethergate.gateway.auth.service.AuthService;
import com.aethergate.gateway.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Registration successful. Please verify your email.",
                        response
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful.",
                        response
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyOtp(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Email verified successfully. You can now log in.",
                        null
                )
        );
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(
            @Valid @RequestBody ResendOtpRequest request) {

        authService.resendOtp(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Verification code sent successfully.",
                        null
                )
        );
    }
}