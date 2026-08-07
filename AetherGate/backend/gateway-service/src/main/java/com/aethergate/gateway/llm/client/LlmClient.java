package com.aethergate.gateway.llm.client;

import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;

public interface LlmClient {

    ChatResponse generate(ChatRequest request);

}