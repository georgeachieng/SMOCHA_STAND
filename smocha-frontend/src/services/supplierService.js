import api from './api';

const supplierService = {
  getAll: () => api.get('/suppliers/'),
  getOne: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  remove: (id) => api.delete(`/suppliers/${id}`),
};

export default supplierService;
