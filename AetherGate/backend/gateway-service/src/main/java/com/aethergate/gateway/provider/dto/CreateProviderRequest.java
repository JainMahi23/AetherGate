package com.aethergate.gateway.provider.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProviderRequest {

    @NotBlank(message = "Provider name is required")
    @Size(max = 100)
    private String providerName;

    @NotBlank(message = "Provider code is required")
    @Size(max = 50)
    private String providerCode;

    @NotBlank(message = "Base URL is required")
    @Size(max = 500)
    private String baseUrl;

    @NotBlank(message = "API key is required")
    @Size(max = 500)
    private String apiKey;

    @NotBlank(message = "Model name is required")
    @Size(max = 150)
    private String modelName;

    @NotNull(message = "Enabled flag is required")
    private Boolean enabled;

    @NotNull(message = "Healthy flag is required")
    private Boolean healthy;

    @NotNull(message = "Priority is required")
    @Min(value = 1, message = "Priority must be at least 1")
    private Integer priority;

    @NotNull(message = "Timeout is required")
    @Min(value = 1000, message = "Timeout must be at least 1000 ms")
    private Integer timeoutMs;
}