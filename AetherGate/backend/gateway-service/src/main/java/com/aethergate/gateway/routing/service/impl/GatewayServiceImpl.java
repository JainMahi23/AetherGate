package com.aethergate.gateway.routing.service.impl;

import com.aethergate.gateway.llm.factory.LlmProviderFactory;
import com.aethergate.gateway.llm.service.LlmProviderService;
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

        String providerName = request.getProvider();

        if (providerName == null || providerName.isBlank()) {
            providerName = "OPENAI";
        }

        LlmProviderService provider =
                providerFactory.getProvider(providerName);

        return provider.chat(request);
    }
}