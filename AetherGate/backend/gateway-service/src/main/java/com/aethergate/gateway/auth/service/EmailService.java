package com.aethergate.gateway.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromAddress;

    /**
     * Sends a 6-digit OTP to the specified email.
     * The OTP value is passed in but never logged or persisted in plain text.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("AetherGate – Verify Your Email");
            message.setText(
                    "Welcome to AetherGate!\n\n" +
                    "Your verification code is: " + otp + "\n\n" +
                    "This code expires in 5 minutes.\n" +
                    "If you did not register, please ignore this email.\n\n" +
                    "— AetherGate Team"
            );
            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send verification email. Please try again.");
        }
    }
}
