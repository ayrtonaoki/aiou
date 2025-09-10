import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { email, password }
        })
      });

      const data = await res.json();

      if (res.ok) {
        const token = res.headers.get('Authorization')?.replace('Bearer ', '');
        if (token) localStorage.setItem('authToken', token);

        setUser(data.user);
        return { success: true };
      } else {
        setAuthError(data.error || 'Invalid email or password');
        return { success: false, error: data.error };
      }
    } catch (err) {
      setAuthError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, password) => {
    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { email, password, password_confirmation: password }
        })
      });

      const data = await res.json();

      if (res.ok) {
        const token = res.headers.get('Authorization')?.replace('Bearer ', '');
        if (token) localStorage.setItem('authToken', token);

        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.errors?.join(', ') || 'Registration failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/api/v1/current_user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, authError, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
