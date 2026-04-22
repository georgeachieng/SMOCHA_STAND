function SupplierTable({ suppliers, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <h3>Supplier List</h3>

      {suppliers.length === 0 ? (
        <p>No suppliers available.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.address}</td>
                <td>
                  <button onClick={() => onEdit(supplier)}>Edit</button>
                  <button
                    onClick={() => onDelete(supplier.id)}
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

export default SupplierTable;