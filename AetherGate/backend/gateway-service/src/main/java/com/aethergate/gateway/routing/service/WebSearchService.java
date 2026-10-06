package com.aethergate.gateway.routing.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Lightweight web search integration using Google Custom Search JSON API.
 * Detects queries requiring live/current information, retrieves relevant
 * web results, and returns them as context snippets for LLM augmentation.
 */
@Service
@Slf4j
public class WebSearchService {

    private final WebClient webClient;
    private final String apiKey;
    private final String engineId;
    private final boolean enabled;

    private static final String SEARCH_URL = "https://www.googleapis.com/customsearch/v1";
    private static final int MAX_RESULTS = 5;

    // Keywords that suggest the query needs current/live information
    private static final Set<String> LIVE_KEYWORDS = Set.of(
            "today", "tonight", "yesterday", "latest", "current", "recent", "now",
            "this week", "this month", "this year", "breaking", "live",
            "score", "weather", "price", "stock", "rate", "news",
            "just happened", "right now", "happening", "update", "result",
            "who won", "who is winning", "what happened", "trending",
            "new release", "announced", "launched", "election"
    );

    private static final Pattern LIVE_PATTERN = Pattern.compile(
            "\\b(" + String.join("|", LIVE_KEYWORDS) + ")\\b",
            Pattern.CASE_INSENSITIVE
    );

    public WebSearchService(
            WebClient webClient,
            @Value("${search.api.key:}") String apiKey,
            @Value("${search.engine.id:}") String engineId) {
        this.webClient = webClient;
        this.apiKey = apiKey;
        this.engineId = engineId;
        this.enabled = apiKey != null && !apiKey.isBlank()
                && engineId != null && !engineId.isBlank();

        if (enabled) {
            log.info("Web search integration enabled");
        } else {
            log.info("Web search integration disabled (GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_ENGINE_ID not set)");
        }
    }

    /**
     * Determines if a query likely needs current/live information.
     */
    public boolean needsLiveSearch(String query) {
        if (!enabled || query == null || query.isBlank()) {
            return false;
        }
        return LIVE_PATTERN.matcher(query).find();
    }

    /**
     * Searches the web and returns a list of result snippets with titles and links.
     * Returns empty list on failure (non-blocking — the LLM will still answer without search context).
     */
    public List<SearchSnippet> search(String query) {
        if (!enabled) {
            return List.of();
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.get()
                    .uri(SEARCH_URL, uriBuilder -> uriBuilder
                            .queryParam("key", apiKey)
                            .queryParam("cx", engineId)
                            .queryParam("q", query)
                            .queryParam("num", MAX_RESULTS)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block(java.time.Duration.ofSeconds(8));

            if (response == null || !response.containsKey("items")) {
                return List.of();
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

            List<SearchSnippet> snippets = new ArrayList<>();
            for (Map<String, Object> item : items) {
                String title = (String) item.getOrDefault("title", "");
                String snippet = (String) item.getOrDefault("snippet", "");
                String link = (String) item.getOrDefault("link", "");

                if (!snippet.isBlank()) {
                    snippets.add(new SearchSnippet(title, snippet, link));
                }
            }

            log.debug("Web search for '{}' returned {} results", query, snippets.size());
            return snippets;

        } catch (Exception e) {
            log.warn("Web search failed for query '{}': {}", query, e.getMessage());
            return List.of();
        }
    }

    /**
     * Builds a context block from search results to prepend to the LLM prompt.
     */
    public String buildSearchContext(List<SearchSnippet> snippets) {
        if (snippets == null || snippets.isEmpty()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("[Web Search Results — use these for current/live information]\n\n");

        for (int i = 0; i < snippets.size(); i++) {
            SearchSnippet s = snippets.get(i);
            sb.append(String.format("[%d] %s\n%s\nSource: %s\n\n",
                    i + 1, s.title(), s.snippet(), s.link()));
        }

        sb.append("[End of search results]\n\n" +
                "Using the search results above as context for current information, " +
                "answer the following question. Cite relevant sources where appropriate.\n\n");

        return sb.toString();
    }

    /**
     * Immutable search result snippet.
     */
    public record SearchSnippet(String title, String snippet, String link) {}
}
