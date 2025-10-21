/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Load user data - pakai useCallback biar stabil
  const loadUser = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/auth/profile'); // UBAH DISINI
      setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/login', { // UBAH DISINI
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal',
      };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/register', userData); // UBAH DISINI
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registrasi gagal',
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
