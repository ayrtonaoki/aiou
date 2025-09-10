import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '100px auto',
        padding: 20,
        borderRadius: 8,
        backgroundColor: darkMode ? '#1a1a1a' : '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'all 0.3s ease'
      }}
    >
      <h1>Welcome, {user?.email}!</h1>
      <p>You are now logged in.</p>

      <button
        onClick={toggleDarkMode}
        style={{
          marginTop: 20,
          marginBottom: 20,
          padding: 8,
          width: '50%',
          cursor: 'pointer',
          backgroundColor: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#f9f9f9' : '#1a1a1a',
          border: 'none',
          borderRadius: 4
        }}
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <button
        onClick={logout}
        style={{
          display: 'block',
          margin: '20px auto 0',
          padding: '10px 20px',
          backgroundColor: darkMode ? '#555' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
