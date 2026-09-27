package com.aethergate.gateway.llm.client.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@Profile("groq")
@RequiredArgsConstructor
public class GroqClient implements LlmClient {

    private final WebClient webClient;

    @Value("${groq.base.url}")
    private String baseUrl;

    @Value("${groq.api.key}")
    private String apiKey;

    @Override
    public ChatResponse generate(ChatRequest request) {

        long startTime = System.currentTimeMillis();

        Map<String, Object> body = Map.of(
                "model", "openai/gpt-oss-120b",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", request.getPrompt()
                        )
                )
        );

        OpenAICompatibleResponse response = webClient.post()
                .uri(baseUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(OpenAICompatibleResponse.class)
                .block(Duration.ofSeconds(30));

        if (response == null
                || response.choices() == null
                || response.choices().isEmpty()
                || response.choices().get(0).message() == null) {

            throw new IllegalStateException(
                    "Invalid response received from Groq"
            );
        }

        long responseTime = System.currentTimeMillis() - startTime;

        return ChatResponse.builder()
                .provider("GROQ")
                .response(response.choices().get(0).message().content())
                .responseTime(responseTime)
                .build();
    }

    private record OpenAICompatibleResponse(
            List<Choice> choices
    ) {}

    private record Choice(
            Message message
    ) {}

    private record Message(
            String role,
            String content
    ) {}
}