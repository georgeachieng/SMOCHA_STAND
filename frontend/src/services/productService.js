import api from './api.js';

const productService = {
  getProducts: () => api.getProducts(),
  createProduct: (product) => api.createProduct(product),
  updateProduct: (id, product) => api.updateProduct(id, product),
  deleteProduct: (id) => api.deleteProduct(id),
};

export default productService;