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
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState({
    login: true,
    signup: true,
    logout: true,
  });

  const handleFilterChange = (eventType) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [eventType]: !prev[eventType],
    }));
  };

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
      .catch((err) => console.error('Error:', err));
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
          Users access events dashboard:
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          {['signup', 'login', 'logout'].map((type) => {
            const active = selectedEvents[type];
            const colors = { signup: '#22C55E', login: '#3B82F6', logout: '#EF4444' };

            return (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: `2px solid ${colors[type]}`,
                  backgroundColor: active ? colors[type] : 'transparent',
                  color: active ? '#fff' : colors[type],
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: '0.2s',
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>

        <div style={{ width: '100%', height: 350, marginTop: 30 }}>
          {data.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#ccc'} />
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
                {selectedEvents.signup && (
                  <Bar
                    dataKey="signup"
                    fill="#2dca67ff"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                    name="Signups"
                  />
                )}
                {selectedEvents.login && (
                  <Bar
                    dataKey="login"
                    fill="#3B82F6"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                    name="Logins"
                  />
                )}
                {selectedEvents.logout && (
                  <Bar
                    dataKey="logout"
                    fill="#EF4444"
                    barSize={20}
                    radius={[4, 4, 0, 0]}
                    name="Logouts"
                  />
                )}
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
