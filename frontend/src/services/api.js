import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth token
api.interceptors.response.use(
  (response) => {
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem('authToken', token.replace('Bearer ', ''));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/login', {
      user: { email, password },
    }),

  register: (email, password) =>
    api.post('/signup', {
      user: { email, password },
    }),

  logout: () => api.delete('/logout'),

  getCurrentUser: () => api.get('/api/v1/current_user'),
};

export const postsAPI = {
  getPosts: () => api.get('/api/v1/posts'),
  createPost: (postData) => api.post('/api/v1/posts', { post: postData }),
  updatePost: (id, postData) => api.put(`/api/v1/posts/${id}`, { post: postData }),
  deletePost: (id) => api.delete(`/api/v1/posts/${id}`),
};

export default api;
