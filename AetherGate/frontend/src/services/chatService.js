import api from '../config/api';

/**
 * POST /api/v1/chat
 * Request: { prompt, provider? }
 *   provider = null or undefined → Auto routing
 *   provider = "GEMINI" | "GROQ" → Explicit routing
 * Response: ApiResponse<{ provider, response, responseTime }>
 */
export async function sendChat(prompt, provider) {
  const body = { prompt };
  if (provider && provider !== 'AUTO') {
    body.provider = provider;
  }
  const response = await api.post('/api/v1/chat', body);
  return response.data; // { success, message, data: { provider, response, responseTime } }
}
