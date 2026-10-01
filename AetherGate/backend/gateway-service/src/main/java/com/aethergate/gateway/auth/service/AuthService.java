package com.aethergate.gateway.auth.service;

import com.aethergate.gateway.auth.dto.AuthResponse;
import com.aethergate.gateway.auth.dto.LoginRequest;
import com.aethergate.gateway.auth.dto.RegisterRequest;
import com.aethergate.gateway.auth.dto.ResendOtpRequest;
import com.aethergate.gateway.auth.dto.VerifyOtpRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void resendOtp(ResendOtpRequest request);
}