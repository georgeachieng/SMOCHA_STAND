import api from './api';

const inventoryService = {
  getAll: () => api.get('/transactions/'),
  getOne: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions/', data),
};

export default inventoryService;
