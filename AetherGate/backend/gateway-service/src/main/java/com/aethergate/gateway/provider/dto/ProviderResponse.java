package com.aethergate.gateway.provider.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProviderResponse {

    private Long id;

    private String providerName;

    private String providerCode;

    private String baseUrl;

    private String modelName;

    private Boolean enabled;

    private Boolean healthy;

    private Integer priority;

    private Integer timeoutMs;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}