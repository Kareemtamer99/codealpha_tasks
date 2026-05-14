/**
 * API Client — Fetch wrapper with JWT management
 */
const API_BASE = '/api';

let authToken = localStorage.getItem('rms_token') || null;

const setToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('rms_token', token);
  } else {
    localStorage.removeItem('rms_token');
  }
};

const getToken = () => authToken;

const request = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers: customHeaders = {} } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = { method, headers };
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // Handle unauthorized
    if (response.status === 401) {
      setToken(null);
      localStorage.removeItem('rms_user');
      window.location.hash = '';
      document.getElementById('app').classList.add('hidden');
      document.getElementById('auth-screen').classList.remove('hidden');
    }
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Convenience methods
const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  setToken,
  getToken,
};

export default api;
