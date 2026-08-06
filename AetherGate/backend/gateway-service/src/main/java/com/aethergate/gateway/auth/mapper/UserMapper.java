package com.aethergate.gateway.auth.mapper;

import com.aethergate.gateway.auth.dto.RegisterRequest;
import com.aethergate.gateway.auth.entity.User;
import com.aethergate.gateway.enums.Role;

public class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(RegisterRequest request) {

        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.ROLE_USER)
                .enabled(true)
                .build();
    }

}