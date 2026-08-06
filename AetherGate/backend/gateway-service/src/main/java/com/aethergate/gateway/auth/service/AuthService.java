package com.aethergate.gateway.auth.service;

import com.aethergate.gateway.auth.dto.AuthResponse;
import com.aethergate.gateway.auth.dto.LoginRequest;
import com.aethergate.gateway.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}