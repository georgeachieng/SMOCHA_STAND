function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <h3>Category List</h3>

      {categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button onClick={() => onEdit(category)}>Edit</button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoryTable;