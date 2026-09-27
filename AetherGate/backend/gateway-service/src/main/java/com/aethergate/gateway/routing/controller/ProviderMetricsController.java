package com.aethergate.gateway.routing.controller;

import com.aethergate.gateway.common.response.ApiResponse;
import com.aethergate.gateway.routing.service.ProviderMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/metrics")
@RequiredArgsConstructor
public class ProviderMetricsController {

    private final ProviderMetricsService metricsService;

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getMetrics() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Provider metrics retrieved successfully.",
                        metricsService.getMetrics()
                )
        );
    }
}