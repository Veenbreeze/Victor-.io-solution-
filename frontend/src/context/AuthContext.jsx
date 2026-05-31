import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('veenbreeze_user'));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('veenbreeze_token'));
  const [loading, setLoading] = useState(false);

  const persistSession = (payload) => {
    localStorage.setItem('veenbreeze_token', payload.token);
    localStorage.setItem('veenbreeze_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authService.login(credentials);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await authService.register(payload);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('veenbreeze_token');
    localStorage.removeItem('veenbreeze_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
