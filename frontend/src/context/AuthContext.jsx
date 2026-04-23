import { createContext, useEffect, useState } from "react";
import {
  clearStoredSession,
  getCurrentUser,
  getStoredSession,
  loginUser,
  registerUser,
  storeSession,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const session = getStoredSession();

      if (!session?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(session.token);
        setUser(currentUser);
        setToken(session.token);
      } catch (error) {
        clearStoredSession();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const session = await loginUser(credentials);
    storeSession(session);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  };

  const register = async (payload) => {
    const session = await registerUser(payload);
    storeSession(session);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
