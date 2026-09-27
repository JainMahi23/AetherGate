import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getEmailFromToken, getRoleFromToken, isTokenExpired, getDisplayName } from '../utils/jwtUtils';

const AuthContext = createContext(null);

const TOKEN_KEY = 'aethergate_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Build user object from token
  const buildUser = useCallback((rawToken) => {
    if (!rawToken || isTokenExpired(rawToken)) return null;
    const email = getEmailFromToken(rawToken);
    const role = getRoleFromToken(rawToken);
    return {
      email,
      displayName: getDisplayName(email),
      role,
      isAdmin: role === 'ROLE_ADMIN',
    };
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
      setUser(buildUser(stored));
    } else {
      // Stale token
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
    setIsLoading(false);
  }, [buildUser]);

  const login = useCallback((accessToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(buildUser(accessToken));
  }, [buildUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
