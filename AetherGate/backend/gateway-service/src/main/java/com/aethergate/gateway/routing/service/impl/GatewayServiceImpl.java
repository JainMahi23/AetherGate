package com.aethergate.gateway.routing.service.impl;

import com.aethergate.gateway.llm.client.LlmClient;
import com.aethergate.gateway.llm.exception.LlmProviderException;
import com.aethergate.gateway.llm.factory.LlmProviderFactory;
import com.aethergate.gateway.provider.entity.Provider;
import com.aethergate.gateway.provider.repository.ProviderRepository;
import com.aethergate.gateway.routing.dto.ChatRequest;
import com.aethergate.gateway.routing.dto.ChatResponse;
import com.aethergate.gateway.routing.service.GatewayService;
import com.aethergate.gateway.routing.service.ProviderMetricsService;
import com.aethergate.gateway.routing.service.WebSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GatewayServiceImpl implements GatewayService {

    private final LlmProviderFactory providerFactory;
    private final ProviderRepository providerRepository;
    private final ProviderMetricsService metricsService;
    private final WebSearchService webSearchService;

    @Override
    public ChatResponse chat(ChatRequest request) {

        List<Provider> availableProviders =
                providerRepository
                        .findAllByEnabledTrueAndHealthyTrueOrderByPriorityAsc();

        if (availableProviders.isEmpty()) {
            throw new LlmProviderException(
                    "AETHERGATE",
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "NO_PROVIDER_AVAILABLE",
                    "No healthy LLM provider is available."
            );
        }

        // --- Web Search Augmentation ---
        // If the query needs live/current information, search the web first
        // and augment the prompt with search context.
        String originalPrompt = request.getPrompt();
        List<WebSearchService.SearchSnippet> searchSnippets = List.of();

        if (webSearchService.needsLiveSearch(originalPrompt)) {
            searchSnippets = webSearchService.search(originalPrompt);

            if (!searchSnippets.isEmpty()) {
                String searchContext = webSearchService.buildSearchContext(searchSnippets);
                // Create a new request with the augmented prompt
                request = ChatRequest.builder()
                        .prompt(searchContext + originalPrompt)
                        .provider(request.getProvider())
                        .build();
            }
        }

        // --- Provider Routing (unchanged) ---
        String requestedProvider = request.getProvider();

        if (requestedProvider != null && !requestedProvider.isBlank()) {

            String requestedCode = requestedProvider.toUpperCase();

            for (Provider provider : availableProviders) {

                if (!provider.getProviderCode()
                        .equalsIgnoreCase(requestedCode)) {
                    continue;
                }

                try {

                    LlmClient client =
                            providerFactory.getClient(requestedCode);

                    ChatResponse response = client.generate(request);

                    metricsService.recordSuccess(
                            requestedCode,
                            response.getResponseTime()
                    );

                    return attachSources(response, searchSnippets);

                } catch (LlmProviderException ex) {

                    metricsService.recordFailure(requestedCode);

                }

                break;
            }
        }

        /*
         * Automatic routing according to provider priority.
         */
        for (Provider provider : availableProviders) {

            String providerCode = provider.getProviderCode();

            if (requestedProvider != null
                    && !requestedProvider.isBlank()
                    && providerCode.equalsIgnoreCase(requestedProvider)) {
                continue;
            }

            try {

                LlmClient client =
                        providerFactory.getClient(providerCode);

                ChatResponse response = client.generate(request);

                metricsService.recordSuccess(
                        providerCode,
                        response.getResponseTime()
                );

                return attachSources(response, searchSnippets);

            } catch (LlmProviderException ex) {

                metricsService.recordFailure(providerCode);
            }
        }

        throw new LlmProviderException(
                "AETHERGATE",
                HttpStatus.BAD_GATEWAY,
                "ALL_PROVIDERS_FAILED",
                "All available LLM providers failed."
        );
    }

    /**
     * Attaches web search source attribution to the response, if any.
     */
    private ChatResponse attachSources(ChatResponse response,
                                       List<WebSearchService.SearchSnippet> snippets) {
        if (snippets != null && !snippets.isEmpty()) {
            List<ChatResponse.Source> sources = snippets.stream()
                    .map(s -> ChatResponse.Source.builder()
                            .title(s.title())
                            .link(s.link())
                            .build())
                    .toList();
            response.setSources(sources);
        }
        return response;
    }
}