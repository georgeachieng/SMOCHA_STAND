import { useAuth } from "../hooks/useAuth";

const cardStyle = {
  borderRadius: "1rem",
  border: "1px solid #e2e8f0",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "1rem",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.07)",
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <section
        style={{
          ...cardStyle,
          background:
            "linear-gradient(135deg, rgba(17, 24, 39, 0.96), rgba(180, 95, 6, 0.95))",
          color: "#ffffff",
          padding: "1.25rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#fde68a",
          }}
        >
          Dashboard
        </p>
        <h1 style={{ margin: "0.5rem 0 0.4rem", fontSize: "1.75rem" }}>
          Welcome, {user?.username ?? "team member"}.
        </h1>
        <p style={{ margin: 0, maxWidth: "50ch", lineHeight: 1.7, color: "#f8fafc", fontSize: "0.9rem" }}>
        Dashboard provides an overview of your account and recent activity.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#6b7280" }}>Signed in as</p>
          <h2 style={{ margin: "0.5rem 0 0", color: "#172033" }}>
            {user?.role ?? "staff"}
          </h2>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#6b7280" }}>Account email</p>
          <h2 style={{ margin: "0.5rem 0 0", color: "#172033", fontSize: "1.05rem" }}>
            {user?.email ?? "No email available"}
          </h2>
        </article>
        <article style={cardStyle}>
          <p style={{ margin: 0, color: "#6b7280" }}>Status</p>
          <h2 style={{ margin: "0.5rem 0 0", color: "#172033" }}>Layout ready</h2>
        </article>
      </section>
    </div>
  );
}
