import api from '../config/api';

/**
 * POST /api/v1/auth/login
 * Request: { email, password }
 * Response: ApiResponse<{ accessToken, tokenType }>
 */
export async function loginUser(email, password) {
  const response = await api.post('/api/v1/auth/login', { email, password });
  return response.data; // { success, message, data: { accessToken, tokenType } }
}

/**
 * POST /api/v1/auth/register
 * Request: { fullName, email, password }
 * Response: ApiResponse<{ accessToken (null), tokenType }>
 */
export async function registerUser(fullName, email, password) {
  const response = await api.post('/api/v1/auth/register', { fullName, email, password });
  return response.data;
}

/**
 * POST /api/v1/auth/verify-otp
 * Request: { email, otp }
 * Response: ApiResponse<null>
 */
export async function verifyOtp(email, otp) {
  const response = await api.post('/api/v1/auth/verify-otp', { email, otp });
  return response.data;
}

/**
 * POST /api/v1/auth/resend-otp
 * Request: { email }
 * Response: ApiResponse<null>
 */
export async function resendOtp(email) {
  const response = await api.post('/api/v1/auth/resend-otp', { email });
  return response.data;
}
