import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

import { AuthContext, User } from './AuthContext';

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hisp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('hisp_token'),
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('hisp_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('hisp_token');
      localStorage.removeItem('hisp_user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('hisp_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hisp_token');
    localStorage.removeItem('hisp_user');
    setToken(null);
    setUser(null);
  };

  const Provider = AuthContext.Provider as any;
  return (
    <Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </Provider>
  ) as React.ReactElement;
};
