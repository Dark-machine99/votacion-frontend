// src/router/VoterRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VoterRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p className="small">Cargando...</p>;

  if (!user) return <Navigate to="/" replace />;

  if (user.role !== "voter") return <Navigate to="/admin" replace />;

  return children;
}
