package com.aethergate.gateway.routing.controller;

import com.aethergate.gateway.common.response.ApiResponse;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import com.aethergate.gateway.routing.service.GatewayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class GatewayController {

    private final GatewayService gatewayService;

    @PostMapping
    public ResponseEntity<ApiResponse<ChatResponse>> chat(
            @Valid @RequestBody ChatRequest request) {

        ChatResponse response = gatewayService.chat(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Response generated successfully.",
                        response
                )
        );
    }
}