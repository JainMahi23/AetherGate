package com.aethergate.gateway.routing.service.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.llm.exception.LlmProviderException;
import com.aethergate.gateway.llm.factory.LlmProviderFactory;
import com.aethergate.gateway.provider.entity.Provider;
import com.aethergate.gateway.provider.repository.ProviderRepository;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import com.aethergate.gateway.routing.service.GatewayService;
import com.aethergate.gateway.routing.service.ProviderMetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GatewayServiceImpl implements GatewayService {

    private final LlmProviderFactory providerFactory;
    private final ProviderRepository providerRepository;
    private final ProviderMetricsService metricsService;

    @Override
    public ChatResponse chat(ChatRequest request) {

        List<Provider> availableProviders =
                providerRepository
                        .findAllByEnabledTrueAndHealthyTrueOrderByPriorityAsc();

        if (availableProviders.isEmpty()) {
            throw new LlmProviderException(
                    "AETHERGATE",
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "NO_PROVIDER_AVAILABLE",
                    "No healthy LLM provider is available."
            );
        }

        String requestedProvider = request.getProvider();

        if (requestedProvider != null && !requestedProvider.isBlank()) {

            String requestedCode = requestedProvider.toUpperCase();

            for (Provider provider : availableProviders) {

                if (!provider.getProviderCode()
                        .equalsIgnoreCase(requestedCode)) {
                    continue;
                }

                try {

                    LlmClient client =
                            providerFactory.getClient(requestedCode);

                    ChatResponse response = client.generate(request);

                    metricsService.recordSuccess(
                            requestedCode,
                            response.getResponseTime()
                    );

                    return response;

                } catch (LlmProviderException ex) {

                    metricsService.recordFailure(requestedCode);

                }

                break;
            }
        }

        /*
         * Automatic routing according to provider priority.
         */
        for (Provider provider : availableProviders) {

            String providerCode = provider.getProviderCode();

            if (requestedProvider != null
                    && !requestedProvider.isBlank()
                    && providerCode.equalsIgnoreCase(requestedProvider)) {
                continue;
            }

            try {

                LlmClient client =
                        providerFactory.getClient(providerCode);

                ChatResponse response = client.generate(request);

                metricsService.recordSuccess(
                        providerCode,
                        response.getResponseTime()
                );

                return response;

            } catch (LlmProviderException ex) {

                metricsService.recordFailure(providerCode);
            }
        }

        throw new LlmProviderException(
                "AETHERGATE",
                HttpStatus.BAD_GATEWAY,
                "ALL_PROVIDERS_FAILED",
                "All available LLM providers failed."
        );
    }
}