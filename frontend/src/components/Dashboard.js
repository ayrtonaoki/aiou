import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const wrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    transition: 'background 0.3s ease'
  };

  const cardStyle = {
    width: 600,
    padding: 30,
    borderRadius: 8,
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    display: 'block',
    margin: '20px auto 0',
    padding: '10px 20px',
    backgroundColor: darkMode ? '#555' : '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  };

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

        <h1 style={{ marginBottom: 8 }}>Welcome, {user?.email}!</h1>
        <p style={{ marginTop: 0, color: darkMode ? '#ccc' : '#555' }}>
          You are now logged in.
        </p>

        <button style={buttonStyle} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
