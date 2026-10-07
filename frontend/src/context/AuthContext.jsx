import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('nexvo_access_token');
      const storedUser = localStorage.getItem('nexvo_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('nexvo_user');
          localStorage.removeItem('nexvo_access_token');
          localStorage.removeItem('nexvo_refresh_token');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for custom token expiry events
    const handleAuthChange = () => {
      initializeAuth();
    };
    window.addEventListener('nexvo-auth-change', handleAuthChange);
    return () => window.removeEventListener('nexvo-auth-change', handleAuthChange);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await ApiService.login(username, password);
      const { access, refresh, user: userData } = res;

      localStorage.setItem('nexvo_access_token', access);
      localStorage.setItem('nexvo_refresh_token', refresh);
      localStorage.setItem('nexvo_user', JSON.stringify(userData));

      setToken(access);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Authentication failed. Please verify admin credentials.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('nexvo_access_token');
    localStorage.removeItem('nexvo_refresh_token');
    localStorage.removeItem('nexvo_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: !!user?.is_staff || !!user?.is_superuser,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
