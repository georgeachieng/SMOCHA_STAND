import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function FullScreenMessage({ message }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, #fff7ed 0%, #f8fafc 55%, #e2e8f0 100%)",
        color: "#172033",
        fontSize: "1rem",
      }}
    >
      {message}
    </div>
  );
}

export default function ProtectedRoute({ requiredRole, children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullScreenMessage message="Loading your workspace..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <FullScreenMessage message="Access denied: insufficient permissions" />;
  }

  return children ?? <Outlet />;
}
