// src/components/layout/MainLayout.jsx
import { useAuth } from "../../context/AuthContext";

export default function MainLayout({ children, title = "Panel" }) {
  const { user, logout } = useAuth();

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="card dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="title" style={{ marginBottom: 4 }}>{title}</h2>
            <p className="subtitle small" style={{ margin: 0 }}>
              Bienvenido, <strong>{user?.name || "Usuario"}</strong>
              {user?.role && (
                <span className="chip" style={{ marginLeft: 8 }}>{user.role}</span>
              )}
            </p>
          </div>

          <div style={{ display: "flex", gap: ".5rem" }}>
            <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
          </div>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}
