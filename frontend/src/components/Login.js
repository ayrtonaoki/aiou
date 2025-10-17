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

  const wrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    transition: 'background 0.3s ease'
  };

  const cardStyle = {
    width: 400,
    padding: 20,
    borderRadius: 8,
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  const fieldWrapper = {
    width: '80%',
    margin: '0 auto 15px',
    display: 'block'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
    color: darkMode ? '#ddd' : '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
    backgroundColor: darkMode ? '#333' : '#fff',
    color: darkMode ? '#f9f9f9' : '#1a1a1a'
  };

  const submitBtnStyle = {
    width: '40%',
    margin: '15px auto 0 auto',
    display: 'block',
    padding: 10,
    borderRadius: 4,
    border: 'none',
    backgroundColor: '#555',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'center'
  };

  const linkStyle = {
    color: '#808080ff'
  }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <button
          onClick={toggleDarkMode}
          aria-label="Alternar tema claro/escuro"
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            padding: 10,
            cursor: 'pointer',
            backgroundColor: darkMode ? '#333' : '#ddd',
            color: darkMode ? '#f9f9f9' : '#1a1a1a',
            border: 'none',
            borderRadius: '50%',
            fontSize: 18,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <h2 style={{ textAlign: 'center' }}>Access your AIOU account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div style={fieldWrapper}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div style={fieldWrapper}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {authError && (
            <div style={{ color: 'red', marginBottom: 15, textAlign: 'center' }}>
              {authError}
            </div>
          )}

          <button
            type="submit"
            style={submitBtnStyle}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 15 }}>
          Don't have an account? <Link to="/register" style={linkStyle}>Sign Up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
