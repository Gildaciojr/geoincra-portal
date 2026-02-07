import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = Boolean(token);

  const saveAuth = (data) => {
    const accessToken = data?.access_token || "";
    const userData = data?.user || null;

    setToken(accessToken);
    setUser(userData);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

const login = async (email, password) => {
  const resp = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await resp.json();

  if (!resp.ok) {
    console.error("Login error:", data);
    throw new Error(data?.detail || "Falha no login");
  }

  saveAuth(data);
  return data;
};

  const register = async ({ full_name, email, password }) => {
    const resp = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || "Falha no cadastro");

    saveAuth(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
