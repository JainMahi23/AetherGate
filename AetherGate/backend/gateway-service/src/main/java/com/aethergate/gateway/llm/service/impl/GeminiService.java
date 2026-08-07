package com.aethergate.gateway.llm.service.impl;

import com.aethergate.gateway.llm.service.LlmProviderService;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiService implements LlmProviderService {

    @Override
    public String getProviderName() {
        return "GEMINI";
    }

    @Override
    public ChatResponse chat(ChatRequest request) {

        return ChatResponse.builder()
                .provider(getProviderName())
                .response("Mock response from Gemini: " + request.getPrompt())
                .responseTime(120)
                .build();
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}