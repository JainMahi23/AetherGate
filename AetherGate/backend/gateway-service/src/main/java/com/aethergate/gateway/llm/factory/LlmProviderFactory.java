package com.aethergate.gateway.llm.factory;

import com.aethergate.gateway.llm.service.LlmProviderService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class LlmProviderFactory {

    private final Map<String, LlmProviderService> providers;

    public LlmProviderFactory(List<LlmProviderService> providerServices) {

        this.providers = providerServices.stream()
                .collect(Collectors.toMap(
                        service -> service.getProviderName().toUpperCase(),
                        Function.identity()
                ));
    }

    public LlmProviderService getProvider(String providerName) {

        if (providerName == null || providerName.isBlank()) {
            throw new IllegalArgumentException("Provider name cannot be null or empty.");
        }

        LlmProviderService provider = providers.get(providerName.toUpperCase());

        if (provider == null) {
            throw new IllegalArgumentException("Unsupported provider: " + providerName);
        }

        return provider;
    }
}