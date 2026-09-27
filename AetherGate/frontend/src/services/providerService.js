import api from '../config/api';

/**
 * GET /api/v1/providers
 * Response: ApiResponse<ProviderResponse[]>
 */
export async function getAllProviders() {
  const response = await api.get('/api/v1/providers');
  return response.data;
}

/**
 * GET /api/v1/providers/{id}
 * Response: ApiResponse<ProviderResponse>
 */
export async function getProviderById(id) {
  const response = await api.get(`/api/v1/providers/${id}`);
  return response.data;
}

/**
 * POST /api/v1/providers — ADMIN only
 * Request: { providerName, providerCode, baseUrl, apiKey, modelName, enabled, healthy, priority, timeoutMs }
 * Response: ApiResponse<ProviderResponse>
 */
export async function createProvider(data) {
  const response = await api.post('/api/v1/providers', data);
  return response.data;
}

/**
 * PUT /api/v1/providers/{id} — ADMIN only
 * Request: { providerName, baseUrl, apiKey, modelName, enabled, healthy, priority, timeoutMs }
 * Response: ApiResponse<ProviderResponse>
 */
export async function updateProvider(id, data) {
  const response = await api.put(`/api/v1/providers/${id}`, data);
  return response.data;
}

/**
 * DELETE /api/v1/providers/{id} — ADMIN only
 * Response: ApiResponse<String>
 */
export async function deleteProvider(id) {
  const response = await api.delete(`/api/v1/providers/${id}`);
  return response.data;
}
