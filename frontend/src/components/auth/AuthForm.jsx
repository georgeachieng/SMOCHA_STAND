import { useState } from "react";

const styles = {
  field: {
    display: "grid",
    gap: "0.5rem",
  },
  input: {
    border: "1px solid #d5d9e2",
    borderRadius: "0.9rem",
    padding: "0.95rem 1rem",
    fontSize: "0.98rem",
    backgroundColor: "#ffffff",
    color: "#172033",
  },
  label: {
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "#31405f",
  },
};

export default function AuthForm({
  mode,
  title,
  subtitle,
  fields,
  submitLabel,
  footer,
  onSubmit,
}) {
  const [values, setValues] = useState(
    fields.reduce((accumulator, field) => {
      accumulator[field.name] = field.defaultValue ?? "";
      return accumulator;
    }, {}),
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError.message || `Unable to ${mode}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: "min(100%, 460px)",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        border: "1px solid rgba(214, 220, 232, 0.9)",
        borderRadius: "1.5rem",
        padding: "2rem",
        boxShadow: "0 24px 80px rgba(13, 29, 56, 0.14)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            margin: 0,
            color: "#b45f06",
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Smocha Stand
        </p>
        <h1
          style={{
            margin: "0.7rem 0 0.5rem",
            fontSize: "2rem",
            color: "#172033",
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, color: "#5f6f90", lineHeight: 1.6 }}>
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        {fields.map((field) => (
          <label key={field.name} style={styles.field}>
            <span style={styles.label}>{field.label}</span>
            <input
              required={field.required !== false}
              autoComplete={field.autoComplete}
              name={field.name}
              type={field.type ?? "text"}
              value={values[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              style={styles.input}
            />
          </label>
        ))}

        {error ? (
          <div
            style={{
              borderRadius: "0.9rem",
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              padding: "0.9rem 1rem",
              fontSize: "0.92rem",
            }}
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            border: 0,
            borderRadius: "0.95rem",
            padding: "1rem 1.15rem",
            background:
              "linear-gradient(135deg, #111827 0%, #22314e 50%, #915313 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: isSubmitting ? "wait" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>
      </form>

      <div
        style={{
          marginTop: "1.25rem",
          color: "#5f6f90",
          fontSize: "0.94rem",
        }}
      >
        {footer}
      </div>
    </div>
  );
}
