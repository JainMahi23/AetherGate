package com.aethergate.gateway.llm.service;

import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;

public interface LlmProviderService {

    /**
     * Returns provider name.
     * Examples:
     * OPENAI
     * GEMINI
     * CLAUDE
     */
    String getProviderName();

    /**
     * Sends prompt to provider.
     */
    ChatResponse chat(ChatRequest request);

    /**
     * Checks whether provider is available.
     */
    boolean isAvailable();
}