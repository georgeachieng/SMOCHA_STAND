import React from 'react';

const StockStatusBadge = ({ quantity, minLevel }) => {
  let status = { label: 'In Stock', styles: 'bg-green-100 text-green-800 border-green-200' };

  if (quantity <= 0) {
    status = { label: 'Out of Stock', styles: 'bg-red-100 text-red-800 border-red-200' };
  } else if (quantity <= minLevel) {
    status = { label: 'Low Stock', styles: 'bg-amber-100 text-amber-800 border-amber-200' };
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${status.styles}`}>
      {status.label}
    </span>
  );
};

export default StockStatusBadge;