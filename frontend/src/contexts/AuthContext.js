import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user: { email, password } }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setAuthError('');
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
        credentials: 'include',
        body: JSON.stringify({
          user: { email, password, password_confirmation: password },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setAuthError('');
        return { success: true };
      } else {
        setAuthError(data.errors?.join(', ') || 'Registration failed');
        return { success: false, error: data.errors?.join(', ') };
      }
    } catch (err) {
      setAuthError('Network error');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      setUser(null);
      setAuthError('');
    } catch {
      setAuthError('Network error during logout');
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/current_user', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, authError, setAuthError, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
