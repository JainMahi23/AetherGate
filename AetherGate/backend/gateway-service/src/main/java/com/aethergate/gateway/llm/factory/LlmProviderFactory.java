package com.aethergate.gateway.llm.factory;

import com.aethergate.gateway.llm.client.impl.GeminiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LlmProviderFactory {

    private final GeminiClient geminiClient;

    public GeminiClient getGeminiClient() {
        return geminiClient;
    }
}