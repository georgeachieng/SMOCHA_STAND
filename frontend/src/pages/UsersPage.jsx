import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.users);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response.employees);
    } catch (err) {
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee(newEmployee);
      setNewEmployee({ username: "", email: "", password: "" });
      setShowCreateForm(false);
      fetchEmployees();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to create employee");
    }
  };

  const handleDeleteEmployee = async (userId) => {
    if (!confirm("Are you sure you want to remove this employee?")) return;
    try {
      await api.deleteEmployee(userId);
      fetchEmployees();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to remove employee");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "2rem", color: "#172033" }}>User Management</h1>

      {error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            backgroundColor: "#fbbf24",
            color: "#172033",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {showCreateForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateEmployee}
          style={{
            backgroundColor: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#172033" }}>Create Employee</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
              Username
            </label>
            <input
              type="text"
              value={newEmployee.username}
              onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
              Email
            </label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#374151" }}>
              Password
            </label>
            <input
              type="password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
              required
              minLength="8"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Create Employee
          </button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem", color: "#172033" }}>All Users</h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Username</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "1rem", color: "#172033" }}>{user.username}</td>
                    <td style={{ padding: "1rem", color: "#172033" }}>{user.email}</td>
                    <td style={{ padding: "1rem", color: "#172033" }}>
                      <span
                        style={{
                          backgroundColor: user.role === "owner" ? "#fbbf24" : user.role === "employee" ? "#10b981" : "#6b7280",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem", color: "#172033" }}>Employees</h2>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Username</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Email</th>
                  <th style={{ padding: "1rem", textAlign: "left", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "1rem", color: "#172033" }}>{employee.username}</td>
                    <td style={{ padding: "1rem", color: "#172033" }}>{employee.email}</td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}