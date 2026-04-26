import { useEffect, useState } from "react";

function SupplierForm({ onSubmit, selectedSupplier, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (selectedSupplier) {
      setFormData({
        name: selectedSupplier.name || "",
        phone: selectedSupplier.phone || "",
        email: selectedSupplier.email || "",
        address: selectedSupplier.address || "",
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  }, [selectedSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!selectedSupplier) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  };

  return (
    <div className="form-card">
      <h3>{selectedSupplier ? "Edit Supplier" : "Add Supplier"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter supplier name"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit">
            {selectedSupplier ? "Update Supplier" : "Add Supplier"}
          </button>

          {selectedSupplier && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SupplierForm;