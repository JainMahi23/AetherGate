package com.aethergate.gateway.llm.service.impl;

import com.aethergate.gateway.llm.service.LlmProviderService;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class OpenAiService implements LlmProviderService {

    @Override
    public String getProviderName() {
        return "OPENAI";
    }

    @Override
    public ChatResponse chat(ChatRequest request) {

        return ChatResponse.builder()
                .provider(getProviderName())
                .response("Mock response from OpenAI: " + request.getPrompt())
                .responseTime(150)
                .build();
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}