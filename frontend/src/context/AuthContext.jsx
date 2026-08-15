import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('finwise_token') || '');
  const [loading, setLoading] = useState(true);

  const fetchUser = async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch {
      localStorage.removeItem('finwise_token');
      setToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(token);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('finwise_token', response.data.access_token);
    setToken(response.data.access_token);
    return response.data;
  };

  const register = async (payload) => {
    await api.post('/auth/register', payload);
    return login(payload.email, payload.password);
  };

  const logout = () => {
    localStorage.removeItem('finwise_token');
    setToken('');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, setUser }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
