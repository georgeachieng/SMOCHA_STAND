import api from './api.js';

const inventoryService = {
  getLowStock: () => api.request('/api/inventory/low-stock'),
};

export default inventoryService;