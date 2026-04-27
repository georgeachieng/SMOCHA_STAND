import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Products", to: "/products" },
  { label: "Suppliers", to: "/suppliers" },
  { label: "Categories", to: "/categories" },
  { label: "Inventory", to: "/inventory" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const allNavItems = [
    ...navItems,
    ...(user?.role === "owner"
      ? [{ label: "Manage Staff", to: "/staff" }]
      : []),
  ];
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            border: 0,
            backgroundColor: "rgba(15, 23, 42, 0.28)",
            zIndex: 9,
          }}
        />
      ) : null}

      <aside
        style={{
          position: "fixed",
          top: "72px",
          left: 0,
          bottom: 0,
          width: "280px",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 180ms ease",
          background:
            "linear-gradient(180deg, #111827 0%, #172033 60%, #2b3448 100%)",
          color: "#ffffff",
          padding: "1rem 0.75rem",
          zIndex: 10,
          boxShadow: "24px 0 70px rgba(15, 23, 42, 0.22)",
          height: "calc(100vh - 72px)",
        }}
      >
        <div style={{ marginBottom: "1rem", paddingInline: "0.5rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.7rem",
              color: "#fbbf24",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Navigation
          </p>
          <h2 style={{ margin: "0.3rem 0 0", fontSize: "1.1rem" }}>
            Shared app shell
          </h2>
        </div>

        <nav style={{ display: "grid", gap: "0.25rem" }}>
          {allNavItems.map((item) =>
            item.disabled ? (
              <div
                key={item.label}
                style={{
                  borderRadius: "0.9rem",
                  padding: "0.95rem 1rem",
                  color: "#cbd5e1",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.label}</span>
                <small style={{ color: "#94a3b8" }}>Soon</small>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  borderRadius: "0.9rem",
                  padding: "0.95rem 1rem",
                  color: "#ffffff",
                  backgroundColor: isActive
                    ? "rgba(251, 191, 36, 0.18)"
                    : "rgba(255, 255, 255, 0.06)",
                  fontWeight: isActive ? 700 : 500,
                })}
                end
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
      </aside>
    </>
  );
}
