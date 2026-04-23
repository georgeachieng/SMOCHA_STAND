import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "1rem 1.5rem",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderBottom: "1px solid #e5e7eb",
        backdropFilter: "blur(16px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            border: "1px solid #d5d9e2",
            backgroundColor: "#ffffff",
            borderRadius: "0.8rem",
            padding: "0.55rem 0.8rem",
            cursor: "pointer",
          }}
        >
          Menu
        </button>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#b45f06",
              fontWeight: 700,
            }}
          >
            Smocha Stand
          </p>
          <h2
            style={{
              margin: "0.2rem 0 0",
              fontSize: "1.1rem",
              color: "#172033",
            }}
          >
            Inventory workspace
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: "#172033", fontWeight: 700 }}>
            {user?.username ?? "User"}
          </p>
          <p style={{ margin: "0.2rem 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
            {user?.role ?? "staff"}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{
            border: 0,
            borderRadius: "0.8rem",
            padding: "0.75rem 1rem",
            backgroundColor: "#172033",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
