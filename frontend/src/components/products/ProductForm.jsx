import React, { useState } from 'react';

const ProductForm = ({ onSubmit, categories = [], initialData = {} }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    category_id: initialData.category_id || '',
    unit: initialData.unit || 'pcs',
    min_stock: initialData.min_stock || 10
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          className="mt-1 block w-full border rounded-md p-2 focus:ring-indigo-500 outline-none" 
          placeholder="e.g. Eggs"
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            value={form.category_id} 
            onChange={e => setForm({...form, category_id: e.target.value})}
            className="mt-1 block w-full border rounded-md p-2"
            required
          >
            <option value="">Select...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <input 
            value={form.unit} 
            onChange={e => setForm({...form, unit: e.target.value})}
            className="mt-1 block w-full border rounded-md p-2"
            placeholder="pcs/kg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Min. Alert Quantity</label>
        <input 
          type="number"
          value={form.min_stock} 
          onChange={e => setForm({...form, min_stock: e.target.value})}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full font-medium">
        Save Product
      </button>
    </form>
  );
};

export default ProductForm;