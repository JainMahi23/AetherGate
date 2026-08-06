package com.aethergate.gateway.health.controller;

import com.aethergate.gateway.common.response.ApiResponse;
import com.aethergate.gateway.health.dto.HealthStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatus>> health() {

        HealthStatus healthStatus = HealthStatus.builder()
                .status("UP")
                .service("AetherGate")
                .version("1.0.0")
                .build();

        ApiResponse<HealthStatus> response = ApiResponse.<HealthStatus>builder()
                .success(true)
                .message("AetherGate is running successfully")
                .data(healthStatus)
                .build();

        return ResponseEntity.ok(response);
    }
}