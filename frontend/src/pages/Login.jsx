import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../hooks/useAuth";

const fields = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
  },
];

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const destination = location.state?.from?.pathname || "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top, rgba(251, 191, 36, 0.25), transparent 24%), linear-gradient(160deg, #fff7ed 0%, #f8fafc 55%, #dbeafe 100%)",
      }}
    >
      <AuthForm
        mode="login"
        title="Welcome back"
        subtitle="Sign in to place your order or manage the stand."
        fields={fields}
        submitLabel="Login"
        onSubmit={async (values) => {
          await login(values);
          navigate(destination, { replace: true });
        }}
        footer={
          <>
            Need an account?{" "}
            <Link to="/register" style={{ color: "#172033", fontWeight: 700 }}>
              Create one here
            </Link>
            .
          </>
        }
      />
    </div>
  );
}
