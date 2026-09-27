/**
 * Decode a JWT payload without verifying the signature.
 * Used only for extracting display info (email, role).
 * Actual auth validation is done server-side.
 */
export function decodeJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Extract email from JWT sub claim.
 */
export function getEmailFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.sub || null;
}

/**
 * Extract role from JWT authorities (Spring Security format).
 * Returns "ROLE_ADMIN" or "ROLE_USER" or null.
 */
export function getRoleFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;

  // Spring Security puts roles in different possible claim names
  const authorities =
    payload.authorities ||
    payload.roles ||
    payload.role ||
    null;

  if (!authorities) return 'ROLE_USER'; // default

  if (Array.isArray(authorities)) {
    const adminRole = authorities.find(
      (a) => (typeof a === 'string' ? a : a.authority || '').includes('ADMIN')
    );
    return adminRole ? 'ROLE_ADMIN' : 'ROLE_USER';
  }
  if (typeof authorities === 'string') {
    return authorities.includes('ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER';
  }
  return 'ROLE_USER';
}

/**
 * Check if JWT token is expired.
 */
export function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get display name (first part of email before @).
 */
export function getDisplayName(email) {
  if (!email) return 'User';
  const local = email.split('@')[0];
  // Capitalize first letter
  return local.charAt(0).toUpperCase() + local.slice(1);
}
