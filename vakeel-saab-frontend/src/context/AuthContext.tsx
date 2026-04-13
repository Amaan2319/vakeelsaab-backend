import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser } from "../services/api";

const USER_STORAGE_KEY = "vakeel-saab.user";
const TOKEN_STORAGE_KEY = "vakeel-saab.token";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (userData: AuthUser, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredSession(): { user: AuthUser | null; token: string | null } {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    return {
      user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
      token: storedToken,
    };
  } catch {
    return {
      user: null,
      token: null,
    };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState(() => readStoredSession());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSession(readStoredSession());
    setIsHydrated(true);
  }, []);

  const login = (userData: AuthUser, token: string) => {
    const nextSession = { user: userData, token };
    setSession(nextSession);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const logout = () => {
    setSession({ user: null, token: null });
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        isAuthenticated: Boolean(session.user && session.token),
        isHydrated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
