import React, { useState, useEffect } from 'react';
import ProductTable from '../components/products/ProductTable';
import ProductForm from '../components/products/ProductForm';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // In production, use: 
      // const [pData, cData] = await Promise.all([productService.getAll(), categoryService.getAll()]);
      
      // Mock data for now:
      setProducts([
        { id: 1, name: 'Smokie 10-pack', category_id: 1, category_name: 'Protein', min_stock: 5, unit: 'pkts' },
        { id: 2, name: 'Chapati', category_id: 2, category_name: 'Wraps', min_stock: 20, unit: 'pcs' },
      ]);
      setCategories([
        { id: 1, name: 'Protein' },
        { id: 2, name: 'Wraps' },
        { id: 3, name: 'Garnish' }
      ]);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const handleSave = async (formData) => {
    if (editingProduct) {
      console.log("Updating product:", editingProduct.id, formData);
      // await productService.update(editingProduct.id, formData);
    } else {
      console.log("Creating product:", formData);
      // await productService.create(formData);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
    loadInitialData(); // Refresh list
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-500">Define your ingredients and stock alert levels.</p>
        </div>
        
        <button 
          onClick={() => { setEditingProduct(null); setIsFormOpen(!isFormOpen); }}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isFormOpen ? 'bg-gray-200 text-gray-700' : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          }`}
        >
          {isFormOpen ? 'Cancel' : '+ New Product'}
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-10 bg-white p-6 rounded-xl border border-indigo-100 shadow-sm transition-all">
          <h2 className="text-lg font-bold mb-4 text-indigo-900">
            {editingProduct ? 'Edit Product Details' : 'Add New Ingredient'}
          </h2>
          <ProductForm 
            onSubmit={handleSave} 
            categories={categories} 
            initialData={editingProduct || {}} 
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ProductTable 
          products={products} 
          onEdit={(p) => { setEditingProduct(p); setIsFormOpen(true); }}
          onDelete={(id) => console.log("Deleting:", id)}
        />
      </div>
    </div>
  );
};

export default ProductsPage;