package com.aethergate.gateway.routing.service.impl;

import com.aethergate.gateway.llm.factory.LlmProviderFactory;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import com.aethergate.gateway.routing.service.GatewayService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GatewayServiceImpl implements GatewayService {

    private final LlmProviderFactory providerFactory;

    @Override
    public ChatResponse chat(ChatRequest request) {

        String provider = request.getProvider();

        if (provider == null || provider.isBlank()) {
            provider = "GEMINI";
        }

        switch (provider.toUpperCase()) {

            case "GEMINI":
                return providerFactory.getGeminiClient().generate(request);

            default:
                throw new IllegalArgumentException(
                        "Unsupported provider: " + provider
                );
        }
    }
}