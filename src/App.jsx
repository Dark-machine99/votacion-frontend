// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  // No autenticado
  if (!user) return <Navigate to="/" replace />;

  // Ruta requiere rol específico
  if (role && user.role !== role) {
    // Redirección correcta según el tipo de usuario
    return <Navigate to={user.role === "admin" ? "/admin" : "/votar"} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Panel votante */}
      <Route
        path="/votar"
        element={
          <PrivateRoute role="voter">
            <VoterDashboard />
          </PrivateRoute>
        }
      />

      {/* Panel admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
