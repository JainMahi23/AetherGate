package com.aethergate.gateway.routing.service;

import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProviderMetricsService {

    private final Map<String, Metrics> metricsMap = new ConcurrentHashMap<>();

    public void recordSuccess(String provider, long responseTime) {

        Metrics metrics = metricsMap.computeIfAbsent(
                provider.toUpperCase(),
                key -> new Metrics()
        );

        metrics.totalRequests.incrementAndGet();
        metrics.successfulRequests.incrementAndGet();
        metrics.totalResponseTime.addAndGet(responseTime);
        metrics.lastResponseTime.set(responseTime);
    }

    public void recordFailure(String provider) {

        Metrics metrics = metricsMap.computeIfAbsent(
                provider.toUpperCase(),
                key -> new Metrics()
        );

        metrics.totalRequests.incrementAndGet();
        metrics.failedRequests.incrementAndGet();
    }

    public Map<String, MetricsResponse> getMetrics() {

        Map<String, MetricsResponse> result = new ConcurrentHashMap<>();

        metricsMap.forEach((provider, metrics) -> {

            long total = metrics.totalRequests.get();
            long totalResponseTime = metrics.totalResponseTime.get();

            long averageResponseTime =
                    total > 0
                            ? totalResponseTime / metrics.successfulRequests.get()
                            : 0;

            result.put(
                    provider,
                    MetricsResponse.builder()
                            .totalRequests(total)
                            .successfulRequests(
                                    metrics.successfulRequests.get()
                            )
                            .failedRequests(
                                    metrics.failedRequests.get()
                            )
                            .averageResponseTime(averageResponseTime)
                            .lastResponseTime(
                                    metrics.lastResponseTime.get()
                            )
                            .build()
            );
        });

        return result;
    }

    private static class Metrics {

        private final AtomicLong totalRequests = new AtomicLong();
        private final AtomicLong successfulRequests = new AtomicLong();
        private final AtomicLong failedRequests = new AtomicLong();
        private final AtomicLong totalResponseTime = new AtomicLong();
        private final AtomicLong lastResponseTime = new AtomicLong();
    }

    @Data
    @lombok.Builder
    public static class MetricsResponse {

        private long totalRequests;
        private long successfulRequests;
        private long failedRequests;
        private long averageResponseTime;
        private long lastResponseTime;
    }
}