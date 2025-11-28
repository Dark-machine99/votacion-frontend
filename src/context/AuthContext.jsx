// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Cargar usuario desde localStorage cuando se abre la app
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (rawUser && token) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoadingUser(false);
  }, []);

  // Logout seguro
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  // Login
  async function login(email, password) {
    const data = await loginApi(email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    // redirección según rol
    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/voter");
    }
  }

  // Si el backend devuelve 401 → logout automático
  async function handleApiError(err) {
    if (err?.status === 401) {
      logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loadingUser,
        handleApiError,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
