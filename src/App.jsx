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
/* === Shell / contenedor general === */
html, body, #root { height: 100%; }
body { margin: 0; color: #fff; background: #050018; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }

.gradient-bg {
  min-height: 100vh;
  padding: 32px 20px;
  background: radial-gradient(1200px 600px at 10% -10%, #ff00ff 0%, #4b00ff 40%, #050018 70%);
}

/* Tarjetas y contenedores principales */
.card { width: 100%; max-width: 1280px; margin: 0 auto; }
.login-card { max-width: 420px; }
.dashboard-card { max-width: 1280px; }

/* Encabezados / tabs */
.dashboard-header { gap: 16px; flex-wrap: wrap; }
.tabs { justify-content: center; }

/* Grids responsivos */
.grid { 
  display: grid; 
  gap: 16px; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
}
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* Cards específicas */
.election-card, .place-card, .stat-card, .candidate-card {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
}

/* Imágenes proporción 16:9 en cards */
.candidate-photo img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 12px;
}

/* Tabla responsive simple */
.table { width: 100%; overflow: auto; display: block; }

/* === Modal de votar (pantalla completa con ancho max) === */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  z-index: 50;
}
.modal {
  background: rgba(12,6,40,0.95);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  width: min(100%, 1100px);
  max-height: 90vh;
  overflow: auto;
  padding: 18px;
}

/* Inputs ocupan todo el ancho del modal */
.modal .input, .modal textarea, .modal select { width: 100%; }

/* Pequeños ajustes tipográficos */
.title { line-height: 1.2; }
.section-title { font-size: 1.2rem; }
.small { line-height: 1.35; }
