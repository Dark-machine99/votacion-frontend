// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/votar" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/votar"
        element={
          <PrivateRoute>
            <VoterDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
