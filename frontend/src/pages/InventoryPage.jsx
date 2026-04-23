import React, { useState, useEffect } from 'react';
import InventoryTable from '../components/inventory/InventoryTable';
import TransactionForm from '../components/inventory/TransactionForm';
import inventoryService from '../services/inventoryService';

const InventoryPage = () => {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    // const data = await inventoryService.getInventory();
    // setStock(data);
    setStock([
      { id: 1, name: 'Smokie (10pk)', current_stock: 3, min_stock: 5, unit: 'pkts' },
      { id: 2, name: 'Chapatis', current_stock: 45, min_stock: 20, unit: 'pcs' }
    ]);
  };

  const handleTransaction = async (tx) => {
    // await inventoryService.createTransaction(tx);
    console.log("Recorded:", tx);
    loadInventory();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Smocha Stock Control</h1>
      <TransactionForm products={stock} onTransaction={handleTransaction} />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <InventoryTable inventory={stock} />
      </div>
    </div>
  );
};

export default InventoryPage;