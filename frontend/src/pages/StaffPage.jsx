import { useEffect, useState } from "react";
import api from "../services/api.js";

const panelStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
};

const roleBadgeStyles = {
  owner: { backgroundColor: "#f59e0b", color: "#172033" },
  employee: { backgroundColor: "#059669", color: "#ffffff" },
  customer: { backgroundColor: "#475569", color: "#ffffff" },
};

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        ...panelStyle,
        padding: "1rem 1.1rem",
        borderTop: `4px solid ${accent}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#64748b",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0.5rem 0 0",
          fontSize: "1.9rem",
          fontWeight: 800,
          color: "#172033",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function RoleBadge({ role }) {
  const style = roleBadgeStyles[role] ?? roleBadgeStyles.customer;

  return (
    <span
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "0.3rem 0.7rem",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "capitalize",
      }}
    >
      {role}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: "0.85rem",
        backgroundColor: "#f8fafc",
        color: "#64748b",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

export default function StaffPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    void loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getUsers();
      setUsers(response.users ?? []);
    } catch (err) {
      setError(err.message || "Failed to load staff accounts");
    } finally {
      setLoading(false);
    }
  };

  const owners = users.filter((user) => user.role === "owner");
  const employees = users.filter((user) => user.role === "employee");
  const customers = users.filter((user) => user.role === "customer");

  const handleCreateEmployee = async (event) => {
    event.preventDefault();
    setIsCreatingEmployee(true);
    setError(null);

    try {
      await api.createEmployee(newEmployee);
      setNewEmployee({ username: "", email: "", password: "" });
      setShowCreateForm(false);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to create employee");
    } finally {
      setIsCreatingEmployee(false);
    }
  };

  const handleRoleChange = async (user, nextRole) => {
    const actionLabel =
      nextRole === "employee" ? "grant staff access to" : "remove staff access from";

    if (!window.confirm(`Are you sure you want to ${actionLabel} ${user.username}?`)) {
      return;
    }

    setPendingUserId(user.id);
    setError(null);

    try {
      await api.updateUserRole(user.id, nextRole);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to update user role");
    } finally {
      setPendingUserId(null);
    }
  };

  const renderUserTable = ({ title, description, usersToRender, actionLabel, onAction, actionColor }) => (
    <section style={{ ...panelStyle, padding: "1.4rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, color: "#172033", fontSize: "1.2rem" }}>{title}</h2>
        <p style={{ margin: "0.35rem 0 0", color: "#64748b", lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {usersToRender.length === 0 ? (
        <EmptyState message={`No accounts found for ${title.toLowerCase()}.`} />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                  Username
                </th>
                <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                  Email
                </th>
                <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                  Role
                </th>
                <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {usersToRender.map((user) => {
                const isBusy = pendingUserId === user.id;

                return (
                  <tr key={user.id} style={{ borderBottom: "1px solid #eef2f7" }}>
                    <td style={{ padding: "1rem 0.75rem", color: "#172033", fontWeight: 700 }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", color: "#334155" }}>{user.email}</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <RoleBadge role={user.role} />
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <button
                        type="button"
                        onClick={() => onAction(user)}
                        disabled={isBusy}
                        style={{
                          border: 0,
                          borderRadius: "0.7rem",
                          padding: "0.65rem 0.95rem",
                          backgroundColor: actionColor,
                          color: "#ffffff",
                          fontWeight: 700,
                          cursor: isBusy ? "wait" : "pointer",
                          opacity: isBusy ? 0.75 : 1,
                        }}
                      >
                        {isBusy ? "Saving..." : actionLabel}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#475569" }}>
        <p>Loading staff manager...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", display: "grid", gap: "1.5rem" }}>
      <section
        style={{
          ...panelStyle,
          padding: "1.6rem",
          background:
            "linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(255, 255, 255, 0.98) 40%, rgba(219, 234, 254, 0.95))",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#b45309",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.78rem",
          }}
        >
          Owner Controls
        </p>
        <h1 style={{ margin: "0.55rem 0 0", color: "#172033", fontSize: "2rem" }}>
          Manage Staff
        </h1>
        <p style={{ margin: "0.7rem 0 0", color: "#475569", lineHeight: 1.7, maxWidth: "52rem" }}>
          Promote existing customer accounts so they can serve orders, or revoke
          those rights when they should no longer work as staff.
        </p>
      </section>

      {error ? (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "1rem 1.1rem",
            borderRadius: "0.85rem",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      ) : null}

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
        }}
      >
        <StatCard label="Owners" value={owners.length} accent="#f59e0b" />
        <StatCard label="Staff" value={employees.length} accent="#059669" />
        <StatCard label="Customers" value={customers.length} accent="#334155" />
      </section>

      <section style={{ ...panelStyle, padding: "1.4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#172033", fontSize: "1.2rem" }}>
              Create a dedicated staff account
            </h2>
            <p style={{ margin: "0.35rem 0 0", color: "#64748b", lineHeight: 1.5 }}>
              Use this if you want to hire someone directly without asking them to
              register as a customer first.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm((current) => !current)}
            style={{
              border: 0,
              borderRadius: "0.8rem",
              padding: "0.8rem 1.1rem",
              backgroundColor: "#172033",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {showCreateForm ? "Close Form" : "Add Staff Account"}
          </button>
        </div>

        {showCreateForm ? (
          <form
            onSubmit={handleCreateEmployee}
            style={{
              marginTop: "1.25rem",
              display: "grid",
              gap: "1rem",
              padding: "1.2rem",
              borderRadius: "0.9rem",
              backgroundColor: "#f8fafc",
            }}
          >
            <label style={{ display: "grid", gap: "0.45rem", color: "#334155" }}>
              Username
              <input
                type="text"
                value={newEmployee.username}
                onChange={(event) =>
                  setNewEmployee((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                required
                style={{
                  padding: "0.8rem 0.9rem",
                  borderRadius: "0.7rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.45rem", color: "#334155" }}>
              Email
              <input
                type="email"
                value={newEmployee.email}
                onChange={(event) =>
                  setNewEmployee((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
                style={{
                  padding: "0.8rem 0.9rem",
                  borderRadius: "0.7rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "0.45rem", color: "#334155" }}>
              Password
              <input
                type="password"
                value={newEmployee.password}
                onChange={(event) =>
                  setNewEmployee((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                required
                minLength="8"
                style={{
                  padding: "0.8rem 0.9rem",
                  borderRadius: "0.7rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                }}
              />
            </label>

            <button
              type="submit"
              disabled={isCreatingEmployee}
              style={{
                justifySelf: "start",
                border: 0,
                borderRadius: "0.8rem",
                padding: "0.8rem 1.15rem",
                backgroundColor: "#059669",
                color: "#ffffff",
                fontWeight: 700,
                cursor: isCreatingEmployee ? "wait" : "pointer",
                opacity: isCreatingEmployee ? 0.75 : 1,
              }}
            >
              {isCreatingEmployee ? "Creating..." : "Create Staff Account"}
            </button>
          </form>
        ) : null}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {renderUserTable({
          title: "Accounts Ready for Promotion",
          description:
            "These customer accounts can be granted staff rights so they can view and serve customer orders.",
          usersToRender: customers,
          actionLabel: "Grant Serving Rights",
          onAction: (user) => handleRoleChange(user, "employee"),
          actionColor: "#0f766e",
        })}

        {renderUserTable({
          title: "Current Staff",
          description:
            "Revoking staff access keeps the account but returns it to a normal customer role.",
          usersToRender: employees,
          actionLabel: "Revoke Staff Rights",
          onAction: (user) => handleRoleChange(user, "customer"),
          actionColor: "#b91c1c",
        })}
      </section>

      <section style={{ ...panelStyle, padding: "1.4rem" }}>
        <h2 style={{ margin: 0, color: "#172033", fontSize: "1.2rem" }}>
          Owner Accounts
        </h2>
        <p style={{ margin: "0.35rem 0 1rem", color: "#64748b", lineHeight: 1.5 }}>
          Owner accounts are visible here for reference and cannot be edited from
          this screen.
        </p>

        {owners.length === 0 ? (
          <EmptyState message="No owner account found." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                    Username
                  </th>
                  <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                    Email
                  </th>
                  <th style={{ padding: "0.85rem 0.75rem", textAlign: "left", color: "#475569" }}>
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {owners.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #eef2f7" }}>
                    <td style={{ padding: "1rem 0.75rem", color: "#172033", fontWeight: 700 }}>
                      {user.username}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", color: "#334155" }}>{user.email}</td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <RoleBadge role={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
