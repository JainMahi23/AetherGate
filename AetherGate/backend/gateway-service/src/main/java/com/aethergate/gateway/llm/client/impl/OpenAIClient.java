package com.aethergate.gateway.llm.client.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.context.annotation.Profile;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@Profile("openai")
@RequiredArgsConstructor
public class OpenAIClient implements LlmClient {

    private final WebClient webClient;

    @Value("${openai.base.url}")
    private String baseUrl;

    @Value("${openai.api.key}")
    private String apiKey;

    @Override
    public ChatResponse generate(ChatRequest request) {

        long startTime = System.currentTimeMillis();

        Map<String, Object> body = Map.of(
                "model", "gpt-4.1",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", request.getPrompt()
                        )
                )
        );

        OpenAIResponse response = webClient.post()
                .uri(baseUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .block(Duration.ofSeconds(30));

        if (response == null
                || response.choices() == null
                || response.choices().isEmpty()
                || response.choices().get(0).message() == null) {

            throw new IllegalStateException(
                    "Invalid response received from OpenAI"
            );
        }

        long responseTime = System.currentTimeMillis() - startTime;

        return ChatResponse.builder()
                .provider("OPENAI")
                .response(response.choices().get(0).message().content())
                .responseTime(responseTime)
                .build();
    }

    private record OpenAIResponse(
            List<Choice> choices
    ) {
    }

    private record Choice(
            Message message
    ) {
    }

    private record Message(
            String role,
            String content
    ) {
    }
}