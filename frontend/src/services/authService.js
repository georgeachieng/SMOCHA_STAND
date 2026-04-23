const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";
const SESSION_STORAGE_KEY = "smocha.auth";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getStoredSession() {
  const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    clearStoredSession();
    return null;
  }
}

export function storeSession(session) {
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      token: session.token,
      user: session.user,
    }),
  );
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function loginUser(credentials) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  return {
    token: data.access_token,
    user: data.user,
  };
}

export async function registerUser(payload) {
  await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return loginUser({
    username: payload.username,
    password: payload.password,
  });
}

export async function getCurrentUser(token) {
  const data = await request("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.user;
}
