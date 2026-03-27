import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

import { AuthContext, User } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('hisp_token'),
  );
  useEffect(() => {
    if (token) {
      localStorage.setItem('hisp_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('hisp_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
