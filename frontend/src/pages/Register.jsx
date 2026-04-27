import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import { useAuth } from "../hooks/useAuth";

const fields = [
  {
    name: "username",
    label: "Username",
    placeholder: "Choose a username",
    autoComplete: "username",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "new-password",
  },
];

export default function Register() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
        background:
          "radial-gradient(circle at right top, rgba(17, 24, 39, 0.12), transparent 24%), linear-gradient(160deg, #fffaf0 0%, #eff6ff 52%, #dbeafe 100%)",
      }}
    >
      <AuthForm
        mode="register"
        title="Create your account"
        subtitle="Create an account to start ordering from Smocha Stand."
        fields={fields}
        submitLabel="Register"
        onSubmit={async (values) => {
          await register(values);
          navigate("/", { replace: true });
        }}
        footer={
          <>
            Already registered?{" "}
            <Link to="/login" style={{ color: "#172033", fontWeight: 700 }}>
              Log in instead
            </Link>
            .
          </>
        }
      />
    </div>
  );
}
