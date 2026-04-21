const BASE_URL = 'http://127.0.0.1:5000/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

const api = {
  get: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, { headers: getAuthHeaders() }).then((r) => r.json()),
  post: (endpoint, body) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (endpoint, body) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).then((r) => r.json()),
};

export default api;
