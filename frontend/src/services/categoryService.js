import api from './api.js';

const categoryService = {
  getCategories: () => api.getCategories(),
  createCategory: (category) => api.createCategory(category),
  updateCategory: (id, category) => api.updateCategory(id, category),
  deleteCategory: (id) => api.deleteCategory(id),
};

export default categoryService;