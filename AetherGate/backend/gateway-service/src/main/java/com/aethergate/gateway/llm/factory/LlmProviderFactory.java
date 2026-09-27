package com.aethergate.gateway.llm.factory;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.llm.client.impl.GeminiClient;
import com.aethergate.gateway.llm.client.impl.GroqClient;
import com.aethergate.gateway.llm.client.impl.OpenAIClient;
import com.aethergate.gateway.llm.exception.LlmProviderException;
import com.aethergate.gateway.provider.entity.Provider;
import com.aethergate.gateway.provider.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LlmProviderFactory {

    private final GeminiClient geminiClient;
    private final ObjectProvider<OpenAIClient> openAIClientProvider;
    private final ObjectProvider<GroqClient> groqClientProvider;
    private final ProviderRepository providerRepository;

    public LlmClient getClient(String provider) {

        if (provider == null || provider.isBlank()) {
            provider = "GEMINI";
        }

        String providerCode = provider.toUpperCase();

        Provider providerConfig = providerRepository
                .findByProviderCode(providerCode)
                .orElseThrow(() -> new LlmProviderException(
                        providerCode,
                        HttpStatus.BAD_REQUEST,
                        "PROVIDER_NOT_FOUND",
                        "Provider not found: " + providerCode
                ));

        if (!Boolean.TRUE.equals(providerConfig.getEnabled())) {
            throw new LlmProviderException(
                    providerCode,
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "PROVIDER_DISABLED",
                    "Provider is disabled: " + providerCode
            );
        }

        if (!Boolean.TRUE.equals(providerConfig.getHealthy())) {
            throw new LlmProviderException(
                    providerCode,
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "PROVIDER_UNHEALTHY",
                    "Provider is unhealthy: " + providerCode
            );
        }

        return switch (providerCode) {

            case "GEMINI" -> geminiClient;

            case "OPENAI" -> {
                OpenAIClient client = openAIClientProvider.getIfAvailable();

                if (client == null) {
                    throw new LlmProviderException(
                            "OPENAI",
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "PROVIDER_NOT_CONFIGURED",
                            "OpenAI provider is not configured."
                    );
                }

                yield client;
            }

            case "GROQ" -> {
                GroqClient client = groqClientProvider.getIfAvailable();

                if (client == null) {
                    throw new LlmProviderException(
                            "GROQ",
                            HttpStatus.SERVICE_UNAVAILABLE,
                            "PROVIDER_NOT_CONFIGURED",
                            "Groq provider is not configured."
                    );
                }

                yield client;
            }

            default -> throw new LlmProviderException(
                    providerCode,
                    HttpStatus.BAD_REQUEST,
                    "UNSUPPORTED_PROVIDER",
                    "Unsupported provider: " + providerCode
            );
        };
    }
}