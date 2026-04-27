const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Get token from session storage
    const session = JSON.parse(localStorage.getItem('smocha.auth') || 'null');
    const token = session?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User methods
  async getUsers() {
    return this.request('/users');
  }

  async getEmployees() {
    return this.request('/users/employees');
  }

  async createEmployee(employee) {
    return this.request('/users/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  async updateUserRole(id, role) {
    return this.request(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/users/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Category methods
  async getCategories() {
    return this.request('/api/categories');
  }

  async createCategory(category) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id, category) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Product methods
  async getProducts() {
    return this.request('/api/products');
  }

  async createProduct(product) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id, product) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Supplier methods
  async getSuppliers() {
    return this.request('/api/suppliers');
  }

  async createSupplier(supplier) {
    return this.request('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  }

  async updateSupplier(id, supplier) {
    return this.request(`/api/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplier),
    });
  }

  async deleteSupplier(id) {
    return this.request(`/api/suppliers/${id}`, {
      method: 'DELETE',
    });
  }

  // Transaction methods (if implemented)
  async getTransactions() {
    return this.request('/api/transactions');
  }

  async createTransaction(transaction) {
    return this.request('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }
}

export default new ApiService();
