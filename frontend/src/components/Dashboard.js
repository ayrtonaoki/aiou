import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', padding: '20px', textAlign: 'center' }}>
      <h1>Welcome, {user?.email}!</h1>
      <p>You are now logged in.</p>
      <button
        onClick={logout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
