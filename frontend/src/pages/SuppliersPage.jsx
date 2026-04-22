import { useState } from "react";
import SupplierForm from "../components/suppliers/SupplierForm";
import SupplierTable from "../components/suppliers/SupplierTable";

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Coca-Cola",
      phone: "0712345678",
      email: "coke@example.com",
      address: "Nairobi",
    },
    {
      id: 2,
      name: "Mama Mboga",
      phone: "0700000000",
      email: "mama@example.com",
      address: "Kawangware",
    },
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleAddOrUpdate = (formData) => {
    if (selectedSupplier) {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === selectedSupplier.id
            ? { ...supplier, ...formData }
            : supplier
        )
      );
      setSelectedSupplier(null);
    } else {
      const newSupplier = {
        id: suppliers.length + 1,
        ...formData,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleDelete = (id) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));

    if (selectedSupplier && selectedSupplier.id === id) {
      setSelectedSupplier(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedSupplier(null);
  };

  return (
    <div className="page-container">
      <h2>Suppliers Management</h2>
      <p>Manage all suppliers connected to the Smocha Stand system.</p>

      <SupplierForm
        onSubmit={handleAddOrUpdate}
        selectedSupplier={selectedSupplier}
        onCancel={handleCancelEdit}
      />

      <SupplierTable
        suppliers={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SuppliersPage;