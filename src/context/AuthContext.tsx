import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const data = await api.get('/auth/profile');
          setUser(data.user);
        } catch (error) {
          console.error('Не вдалося завантажити профіль:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error.message || 'Помилка входу');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error: any) {
      throw new Error(error.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth має використовуватися всередині AuthProvider');
  }
  return context;
};
