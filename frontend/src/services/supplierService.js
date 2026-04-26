import api from './api.js';

const supplierService = {
  getSuppliers: () => api.getSuppliers(),
  createSupplier: (supplier) => api.createSupplier(supplier),
  updateSupplier: (id, supplier) => api.updateSupplier(id, supplier),
  deleteSupplier: (id) => api.deleteSupplier(id),
};

export default supplierService;