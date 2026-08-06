package com.aethergate.gateway.provider.mapper;

import com.aethergate.gateway.provider.dto.CreateProviderRequest;
import com.aethergate.gateway.provider.dto.ProviderResponse;
import com.aethergate.gateway.provider.entity.Provider;
import org.springframework.stereotype.Component;

@Component
public class ProviderMapper {

    public Provider toEntity(CreateProviderRequest request) {

        return Provider.builder()
                .providerName(request.getProviderName())
                .providerCode(request.getProviderCode())
                .baseUrl(request.getBaseUrl())
                .apiKey(request.getApiKey())
                .modelName(request.getModelName())
                .enabled(request.getEnabled())
                .healthy(request.getHealthy())
                .priority(request.getPriority())
                .timeoutMs(request.getTimeoutMs())
                .build();
    }

    public ProviderResponse toResponse(Provider provider) {

        return ProviderResponse.builder()
                .id(provider.getId())
                .providerName(provider.getProviderName())
                .providerCode(provider.getProviderCode())
                .baseUrl(provider.getBaseUrl())
                .modelName(provider.getModelName())
                .enabled(provider.getEnabled())
                .healthy(provider.getHealthy())
                .priority(provider.getPriority())
                .timeoutMs(provider.getTimeoutMs())
                .createdAt(provider.getCreatedAt())
                .updatedAt(provider.getUpdatedAt())
                .build();
    }
}