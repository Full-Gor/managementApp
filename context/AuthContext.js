import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userId, password) => {
    try {
      const res = await authAPI.login(userId, password);
      if (res.success && res.data?.token) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: res.error || 'Connexion echouee' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, userId, password) => {
    try {
      const res = await authAPI.register(username, userId, password);
      if (res.success && res.data?.token) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: res.error || res.errors?.[0]?.msg || 'Inscription echouee' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
