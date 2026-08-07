package com.aethergate.gateway.llm.client.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import org.springframework.stereotype.Component;

@Component
public class MockGeminiClient implements LlmClient {

    @Override
    public ChatResponse generate(ChatRequest request) {

        return ChatResponse.builder()
                .provider("GEMINI")
                .response("Mock Gemini Client: " + request.getPrompt())
                .responseTime(120)
                .build();
    }
}