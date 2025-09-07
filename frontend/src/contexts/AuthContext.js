import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Backend Rails app URL
  withCredentials: true,
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  // Login function
  const login = async (email, password) => {
    try {
      const res = await API.post('/login', { user: { email, password } });
      setUser(res.data.user);
      setAuthError('');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid email or password';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await API.delete('/logout');
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};
