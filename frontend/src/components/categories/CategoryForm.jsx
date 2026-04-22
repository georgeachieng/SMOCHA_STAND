import { useEffect, useState } from "react";

function CategoryForm({ onSubmit, selectedCategory, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [selectedCategory]);

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

    if (!selectedCategory) {
      setFormData({
        name: "",
        description: "",
      });
    }
  };

  return (
    <div className="form-card">
      <h3>{selectedCategory ? "Edit Category" : "Add Category"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit">
            {selectedCategory ? "Update Category" : "Add Category"}
          </button>

          {selectedCategory && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;