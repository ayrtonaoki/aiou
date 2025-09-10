import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { login, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '100px auto',
        padding: 20,
        borderRadius: 8,
        backgroundColor: darkMode ? '#1a1a1a' : '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <button
        onClick={toggleDarkMode}
        style={{
          marginBottom: 20,
          padding: 8,
          width: '100%',
          cursor: 'pointer',
          backgroundColor: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#f9f9f9' : '#1a1a1a',
          border: 'none',
          borderRadius: 4
        }}
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#f9f9f9' : '#1a1a1a'
            }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ccc',
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#f9f9f9' : '#1a1a1a'
            }}
            disabled={loading}
          />
        </div>
        {authError && <div style={{ color: 'red', marginBottom: 15 }}>{authError}</div>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 4,
            border: 'none',
            backgroundColor: darkMode ? '#555' : '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 15 }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
