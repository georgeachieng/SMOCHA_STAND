import React, { useState } from 'react';

const TransactionForm = ({ products, onTransaction }) => {
  const [data, setData] = useState({ product_id: '', type: 'IN', quantity: '', note: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onTransaction(data);
    setData({ product_id: '', type: 'IN', quantity: '', note: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product</label>
          <select 
            value={data.product_id} 
            onChange={e => setData({...data, product_id: e.target.value})} 
            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          >
            <option value="">Select Smocha Ingredient...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.current_stock} {p.unit} current)</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-40">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
          <select 
            value={data.type} 
            onChange={e => setData({...data, type: e.target.value})} 
            className="w-full border p-2 rounded-md"
          >
            <option value="IN">Stock In (+)</option>
            <option value="OUT">Stock Out (-)</option>
          </select>
        </div>
        <div className="w-full md:w-32">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qty</label>
          <input 
            type="number" 
            value={data.quantity} 
            onChange={e => setData({...data, quantity: e.target.value})} 
            className="w-full border p-2 rounded-md" 
            required 
            min="1"
          />
        </div>
        <button className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition">
          Record
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;