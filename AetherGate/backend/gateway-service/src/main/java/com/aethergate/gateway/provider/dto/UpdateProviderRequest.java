package com.aethergate.gateway.provider.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProviderRequest {

    @NotBlank(message = "Provider name is required")
    @Size(max = 100)
    private String providerName;

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
    @Min(value = 1)
    private Integer priority;

    @NotNull(message = "Timeout is required")
    @Min(value = 1000)
    private Integer timeoutMs;
}