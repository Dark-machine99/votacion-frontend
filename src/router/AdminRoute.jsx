// src/router/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p className="small">Cargando...</p>;

  if (!user) return <Navigate to="/" replace />;

  if (user.role !== "admin") return <Navigate to="/voter" replace />;

  return children;
}
