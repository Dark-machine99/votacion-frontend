// src/router/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import VoterDashboard from "../pages/VoterDashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import VoterRoute from "./VoterRoute";

export default function AppRouter() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Panel Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      {/* Panel Votante */}
      <Route
        path="/voter"
        element=
        {
          <ProtectedRoute>
            <VoterRoute>
              <VoterDashboard />
            </VoterRoute>
          </ProtectedRoute>
        }
      />

      {/* 404 -> Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
