import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/v1/events/event_stats', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error('Erro ao carregar dados do gráfico:', err));
  }, []);

  const wrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkMode ? '#121212' : '#f5f5f5',
    transition: 'background 0.3s ease',
  };

  const cardStyle = {
    width: 700,
    padding: 30,
    borderRadius: 8,
    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
  };

  const buttonStyle = {
    display: 'block',
    margin: '20px auto 0',
    padding: '10px 20px',
    backgroundColor: darkMode ? '#555' : '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
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
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <h1 style={{ marginBottom: 8 }}>Welcome, {user?.email}!</h1>
        <p style={{ marginTop: 0, color: darkMode ? '#ccc' : '#555' }}>
          You are now logged in.
        </p>

        <div style={{ width: '100%', height: 350, marginTop: 30 }}>
          {data.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? '#333' : '#ccc'}
                />
                <XAxis
                  dataKey="date"
                  stroke={darkMode ? '#ccc' : '#555'}
                  tick={{ fill: darkMode ? '#ccc' : '#555' }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={darkMode ? '#ccc' : '#555'}
                  tick={{ fill: darkMode ? '#ccc' : '#555' }}
                />
                <Tooltip
                  cursor={{ fill: darkMode ? '#222' : '#eee' }}
                  contentStyle={{
                    backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                    color: darkMode ? '#fff' : '#000',
                    borderRadius: 8,
                    border: `1px solid ${darkMode ? '#333' : '#ccc'}`,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: darkMode ? '#ccc' : '#555',
                    fontSize: 14,
                  }}
                />
                <Bar
                  dataKey="signup"
                  fill="#28a745"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                  name="Signups"
                />
                <Bar
                  dataKey="login"
                  fill="#007bff"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                  name="Logins"
                />
                <Bar
                  dataKey="logout"
                  fill="#dc3545"
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                  name="Logouts"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: darkMode ? '#aaa' : '#666' }}>
              No event data available yet.
            </p>
          )}
        </div>

        <button style={buttonStyle} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
