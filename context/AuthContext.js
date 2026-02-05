import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, setToken, getToken } from '../utils/api';

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
  const [error, setError] = useState(null);

  // Charger le token au demarrage
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        const res = await authAPI.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          // Token invalide
          await AsyncStorage.removeItem('auth_token');
          setToken(null);
        }
      }
    } catch (e) {
      console.error('Error loading auth:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login(email, password);
      if (res.success && res.token) {
        await AsyncStorage.setItem('auth_token', res.token);
        setUser(res.user);
        return { success: true };
      } else {
        setError(res.error || 'Erreur de connexion');
        return { success: false, error: res.error };
      }
    } catch (e) {
      setError('Erreur reseau');
      return { success: false, error: 'Erreur reseau' };
    }
  };

  const register = async (email, password, name) => {
    setError(null);
    try {
      const res = await authAPI.register(email, password, name);
      if (res.success && res.token) {
        await AsyncStorage.setItem('auth_token', res.token);
        setUser(res.user);
        return { success: true };
      } else {
        setError(res.error || 'Erreur d\'inscription');
        return { success: false, error: res.error };
      }
    } catch (e) {
      setError('Erreur reseau');
      return { success: false, error: 'Erreur reseau' };
    }
  };

  const logout = async () => {
    authAPI.logout();
    await AsyncStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
