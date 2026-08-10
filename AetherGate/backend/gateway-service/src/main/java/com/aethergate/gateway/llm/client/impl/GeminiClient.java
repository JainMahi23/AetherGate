package com.aethergate.gateway.llm.client.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.llm.dto.gemini.GeminiRequest;
import com.aethergate.gateway.llm.dto.gemini.GeminiResponse;
import com.aethergate.gateway.llm.exception.LlmProviderException;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GeminiClient implements LlmClient {

    private final WebClient webClient;

    @Value("${gemini.base.url}")
    private String baseUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Override
    public ChatResponse generate(ChatRequest request) {

        GeminiRequest geminiRequest = GeminiRequest.builder()
                .contents(List.of(
                        GeminiRequest.Content.builder()
                                .parts(List.of(
                                        GeminiRequest.Part.builder()
                                                .text(request.getPrompt())
                                                .build()
                                ))
                                .build()
                ))
                .build();

        GeminiResponse response = webClient.post()
                .uri(baseUrl
                        + "/v1beta/models/gemini-2.0-flash:generateContent?key="
                        + apiKey)
                .bodyValue(geminiRequest)
                .retrieve()
                .onStatus(
                        status -> status.value() == 429,
                        clientResponse -> clientResponse
                                .bodyToMono(String.class)
                                .flatMap(body -> Mono.error(
                                        new LlmProviderException(
                                                "GEMINI",
                                                HttpStatus.TOO_MANY_REQUESTS,
                                                "PROVIDER_QUOTA_EXCEEDED",
                                                "Gemini provider quota exceeded."
                                        )
                                ))
                )
                .onStatus(
                        status -> status.value() == 401 || status.value() == 403,
                        clientResponse -> clientResponse
                                .bodyToMono(String.class)
                                .flatMap(body -> Mono.error(
                                        new LlmProviderException(
                                                "GEMINI",
                                                HttpStatus.BAD_GATEWAY,
                                                "PROVIDER_AUTHENTICATION_FAILED",
                                                "Gemini provider authentication failed."
                                        )
                                ))
                )
                .onStatus(
                        status -> status.is5xxServerError(),
                        clientResponse -> clientResponse
                                .bodyToMono(String.class)
                                .flatMap(body -> Mono.error(
                                        new LlmProviderException(
                                                "GEMINI",
                                                HttpStatus.BAD_GATEWAY,
                                                "PROVIDER_UNAVAILABLE",
                                                "Gemini provider is currently unavailable."
                                        )
                                ))
                )
                .bodyToMono(GeminiResponse.class)
                .block();

        if (response == null
                || response.getCandidates() == null
                || response.getCandidates().isEmpty()
                || response.getCandidates().get(0).getContent() == null
                || response.getCandidates().get(0).getContent().getParts() == null
                || response.getCandidates().get(0).getContent().getParts().isEmpty()) {

            throw new LlmProviderException(
                    "GEMINI",
                    HttpStatus.BAD_GATEWAY,
                    "INVALID_PROVIDER_RESPONSE",
                    "Gemini returned an invalid response."
            );
        }

        String text = response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();

        return ChatResponse.builder()
                .provider("GEMINI")
                .response(text)
                .responseTime(0)
                .build();
    }
}