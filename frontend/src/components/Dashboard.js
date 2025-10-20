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

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterChange = (eventType) => {
    setSelectedEvents((prev) => ({
      ...prev,
      [eventType]: !prev[eventType],
    }));
  };

  const fetchData = () => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);

    fetch(`http://localhost:3000/api/v1/events/event_stats?${queryParams.toString()}`, {
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
  };

  useEffect(() => {
    fetchData();
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

  const controlButtonStyle = {
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s',
  };

  const filterContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    margin: '20px auto',
    flexWrap: 'wrap',
  };

  const dateInputStyle = {
    padding: '10px 14px',
    borderRadius: 10,
    border: darkMode ? '1px solid #333' : '1px solid #ccc',
    backgroundColor: darkMode ? '#222' : '#fff',
    color: darkMode ? '#f0f0f0' : '#111',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: darkMode
      ? 'inset 0 1px 3px rgba(255,255,255,0.05)'
      : 'inset 0 1px 3px rgba(0,0,0,0.1)',
  };

  const buttonStyle = {
    padding: '10px 18px',
    border: 'none',
    borderRadius: 8,
    background: '#333',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.25s ease',
  };

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          padding: '10px 15px',
          backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          color: darkMode ? '#f0f0f0' : '#111',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          fontWeight: 600,
          zIndex: 1000,
        }}
      >
        {user ? `Logged in as: ${user.email}` : 'Not logged in'}
      </div>

      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          display: 'flex',
          gap: 10,
        }}
      >
        <button
          onClick={toggleDarkMode}
          style={{
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
        <button
          onClick={logout}
          style={{
            display: 'block',
            margin: 0,
            padding: '10px 20px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: 8 }}>Events dashboard</h1>
        <div style={filterContainerStyle}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={dateInputStyle}
            onFocus={(e) => (e.target.style.border = '1px solid #3B82F6')}
            onBlur={(e) =>
              (e.target.style.border = darkMode ? '1px solid #333' : '1px solid #ccc')
            }
          />
          <span style={{ color: darkMode ? '#aaa' : '#666' }}>→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={dateInputStyle}
            onFocus={(e) => (e.target.style.border = '1px solid #3B82F6')}
            onBlur={(e) =>
              (e.target.style.border = darkMode ? '1px solid #333' : '1px solid #ccc')
            }
          />
          <button
            onClick={fetchData}
            style={buttonStyle}
          >
            Apply
          </button>
        </div>

        <div style={{ width: '100%', height: 350, marginTop: 20 }}>
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

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          {['signup', 'login', 'logout'].map((type) => {
            const active = selectedEvents[type];
            const colors = { signup: '#22C55E', login: '#3B82F6', logout: '#EF4444' };

            return (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                style={{
                  ...controlButtonStyle,
                  border: `2px solid ${colors[type]}`,
                  backgroundColor: active ? colors[type] : 'transparent',
                  color: active ? '#fff' : colors[type],
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 16px',
          backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          color: darkMode ? '#f0f0f0' : '#111',
          borderRadius: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          fontWeight: 500,
          fontSize: 14,
          zIndex: 1000,
        }}
      >
        Source code on {' '}
        <a
          href="https://github.com/ayrtonaoki/aiou"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: darkMode ? '#f0f0f0' : '#111', textDecoration: 'underline' }}
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
