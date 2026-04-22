import { useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryTable from "../components/categories/CategoryTable";

function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Drinks", description: "Beverages sold at the stand" },
    { id: 2, name: "Snacks", description: "Quick bites and light foods" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddOrUpdate = (formData) => {
    if (selectedCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === selectedCategory.id
            ? { ...category, ...formData }
            : category
        )
      );
      setSelectedCategory(null);
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));

    if (selectedCategory && selectedCategory.id === id) {
      setSelectedCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="page-container">
      <h2>Categories Management</h2>
      <p>Manage all product categories for the Smocha Stand system.</p>

      <CategoryForm
        onSubmit={handleAddOrUpdate}
        selectedCategory={selectedCategory}
        onCancel={handleCancelEdit}
      />

      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default CategoriesPage;