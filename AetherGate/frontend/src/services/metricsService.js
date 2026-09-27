import api from '../config/api';

/**
 * GET /api/v1/metrics
 * Response: ApiResponse<{ GEMINI: MetricsResponse, GROQ: MetricsResponse, ... }>
 *
 * MetricsResponse: { totalRequests, successfulRequests, failedRequests, averageResponseTime, lastResponseTime }
 *
 * NOTE: Metrics are in-memory on the backend and reset on server restart.
 */
export async function getMetrics() {
  const response = await api.get('/api/v1/metrics');
  return response.data;
}
