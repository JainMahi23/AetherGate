/**
 * Map backend errorCode strings to user-friendly messages.
 */
const ERROR_MAP = {
  ALL_PROVIDERS_FAILED:
    'All available AI providers failed to respond. Please try again in a moment.',
  NO_PROVIDER_AVAILABLE:
    'No healthy AI providers are currently available. Please check provider status.',
  PROVIDER_NOT_FOUND:
    'The specified provider could not be found.',
  DUPLICATE_PROVIDER:
    'A provider with this code already exists.',
  PROVIDER_UNHEALTHY:
    'The selected provider is currently unhealthy and cannot process requests.',
  PROVIDER_DISABLED:
    'The selected provider is currently disabled.',
  INTERNAL_SERVER_ERROR:
    'An unexpected server error occurred. Please try again.',
  VALIDATION_FAILED:
    'The request contained invalid data. Please check your input.',
  UNAUTHORIZED:
    'You are not authorized to perform this action. Please log in again.',
  FORBIDDEN:
    'You do not have permission to perform this action.',
};

/**
 * Get a human-readable error message from an axios error response.
 */
export function getErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';

  const response = error.response;
  if (!response) {
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    if (error.message?.includes('Network Error'))
      return 'Cannot reach the AetherGate server. Please ensure the backend is running.';
    return error.message || 'Network error. Please check your connection.';
  }

  const data = response.data;
  const errorCode = data?.errorCode;

  if (errorCode && ERROR_MAP[errorCode]) {
    return ERROR_MAP[errorCode];
  }

  if (data?.message && data.message !== 'No message available') {
    return data.message;
  }

  switch (response.status) {
    case 400: return 'The request was invalid. Please check your input.';
    case 401: return 'Your session has expired. Please log in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. The resource may already exist.';
    case 500: return 'A server error occurred. Please try again.';
    case 503: return 'The service is temporarily unavailable. Please try again shortly.';
    default:  return `Unexpected error (${response.status}). Please try again.`;
  }
}

export { ERROR_MAP };
