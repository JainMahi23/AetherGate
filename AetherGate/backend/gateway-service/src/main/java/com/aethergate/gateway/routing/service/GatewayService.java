package com.aethergate.gateway.routing.service;

import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;

public interface GatewayService {

    ChatResponse chat(ChatRequest request);

}