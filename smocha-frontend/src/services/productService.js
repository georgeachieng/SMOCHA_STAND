import api from './api';

const productService = {
  getAll: () => api.get('/products/'),
  getOne: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/inventory/low-stock'),
  getOutOfStock: () => api.get('/inventory/out-of-stock'),
};

export default productService;
