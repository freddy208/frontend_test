'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from './axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Echec de la recuparation de l\'utilisateur:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      await loadUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Echec de connexion',
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Erreur de deconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Utilisation de AuthProviders requis');
  }
  return context;
}