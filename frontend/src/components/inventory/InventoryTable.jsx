import React from 'react';
import StockStatusBadge from './StockStatusBadge';

const InventoryTable = ({ inventory }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Current Stock</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {item.current_stock} <span className="text-gray-400">{item.unit}</span>
              </td>
              <td className="px-6 py-4">
                <StockStatusBadge quantity={item.current_stock} minLevel={item.min_stock} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;