package com.aethergate.gateway.auth.config;

import com.aethergate.gateway.auth.entity.User;
import com.aethergate.gateway.auth.repository.UserRepository;
import com.aethergate.gateway.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@aethergate.com";

        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .fullName("System Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .emailVerified(true)
                .build();

        userRepository.save(admin);

        System.out.println("===========================================");
        System.out.println("Default Admin Created");
        System.out.println("Email    : admin@aethergate.com");
        System.out.println("Password : Admin@123");
        System.out.println("===========================================");
    }
}