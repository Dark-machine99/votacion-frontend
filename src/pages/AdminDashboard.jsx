// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getAdminElections,
  getAdminCandidates,
  getAdminUsers,
  getAdminAudit,
} from "../api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  // pestaña activa
  const [tab, setTab] = useState("dashboard");

  // datos
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalElections: 0,
    totalVotes: 0,
    participation: 0,
  });
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        if (tab === "dashboard") {
          const data = await getAdminDashboard();
          // aseguramos que tenga las propiedades
          setStats({
            totalUsers: data.totalUsers ?? 0,
            totalElections: data.totalElections ?? 0,
            totalVotes: data.totalVotes ?? 0,
            participation: data.participation ?? 0,
          });
        } else if (tab === "elections") {
          const data = await getAdminElections();
          setElections(data || []);
        } else if (tab === "candidates") {
          const data = await getAdminCandidates();
          setCandidates(data || []);
        } else if (tab === "users") {
          const data = await getAdminUsers();
          setUsers(data || []);
        } else if (tab === "audit") {
          const data = await getAdminAudit();
          setLogs(data || []);
        }
      } catch (err) {
        console.error("Error cargando datos admin:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tab]);

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="card dashboard-card">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <p className="subtitle">Panel de Administración</p>
            <h2 className="title">
              {user?.name || "Administrador"}
            </h2>
            <p className="small">Bienvenido, Administrador</p>
          </div>
          <button className="btn-outline" onClick={logout}>
            Cerrar sesión
          </button>
        </header>

        {/* TABS */}
        <nav className="tabs">
          <button
            className={`tab ${tab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`tab ${tab === "elections" ? "active" : ""}`}
            onClick={() => setTab("elections")}
          >
            Votaciones
          </button>
          <button
            className={`tab ${tab === "candidates" ? "active" : ""}`}
            onClick={() => setTab("candidates")}
          >
            Candidatos
          </button>
          <button
            className={`tab ${tab === "users" ? "active" : ""}`}
            onClick={() => setTab("users")}
          >
            Usuarios
          </button>
          <button
            className={`tab ${tab === "audit" ? "active" : ""}`}
            onClick={() => setTab("audit")}
          >
            Auditoría
          </button>
        </nav>

        {/* CONTENIDO */}
        <main className="dashboard-content">
          {loading && <p className="small">Cargando...</p>}

          {/* DASHBOARD */}
          {tab === "dashboard" && !loading && (
            <>
              <h3 className="section-title">Dashboard de Estadísticas</h3>
              <p className="section-subtitle">
                Vista general del sistema de votación
              </p>
              <div className="grid grid-4">
                <div className="card stat-card">
                  <p className="small">Total Usuarios</p>
                  <h2>{stats.totalUsers}</h2>
                </div>
                <div className="card stat-card">
                  <p className="small">Votaciones</p>
                  <h2>{stats.totalElections}</h2>
                </div>
                <div className="card stat-card">
                  <p className="small">Votos Emitidos</p>
                  <h2>{stats.totalVotes}</h2>
                </div>
                <div className="card stat-card">
                  <p className="small">Participación</p>
                  <h2>{Number(stats.participation || 0).toFixed(1)}%</h2>
                </div>
              </div>
            </>
          )}

          {/* VOTACIONES */}
          {tab === "elections" && !loading && (
            <>
              <h3 className="section-title">Gestión de Votaciones</h3>
              <p className="section-subtitle">
                Administra las votaciones del sistema
              </p>

              <ul className="list">
                {elections.map((e) => (
                  <li key={e.id} className="list-item list-item-card">
                    <div>
                      <strong>{e.title}</strong>
                      <p className="small">{e.description}</p>
                      <p className="small">
                        {new Date(e.start_date).toLocaleDateString()} -{" "}
                        {new Date(e.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`chip status-${e.status}`}>
                      {e.status}
                    </span>
                  </li>
                ))}
                {elections.length === 0 && (
                  <p className="empty">No hay votaciones configuradas.</p>
                )}
              </ul>
            </>
          )}

          {/* CANDIDATOS */}
          {tab === "candidates" && !loading && (
            <>
              <h3 className="section-title">Gestión de Candidatos</h3>
              <div className="grid">
                {candidates.map((c) => (
                  <div key={c.id} className="card candidate-card">
                    <div className="candidate-photo">
                      {c.photo_url && (
                        <img src={c.photo_url} alt={c.name} />
                      )}
                    </div>
                    <h4>{c.name}</h4>
                    <p className="small">{c.party}</p>
                    <p className="small">{c.bio}</p>
                    <p className="small">
                      Elección: {c.election_title || c.election_id}
                    </p>
                  </div>
                ))}
                {candidates.length === 0 && (
                  <p className="empty">No hay candidatos configurados.</p>
                )}
              </div>
            </>
          )}

          {/* USUARIOS */}
          {tab === "users" && !loading && (
            <>
              <h3 className="section-title">Gestión de Usuarios</h3>
              {users.length === 0 ? (
                <p className="empty">No hay usuarios.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.active ? "Activo" : "Inactivo"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* AUDITORÍA */}
          {tab === "audit" && !loading && (
            <>
              <h3 className="section-title">Registro de Auditoría</h3>
              <ul className="list">
                {logs.map((log) => (
                  <li key={log.id} className="list-item list-item-card">
                    <div>
                      <strong>{log.action}</strong>
                      <p className="small">{log.description}</p>
                      <p className="small">
                        {log.user_name || "Sistema"} ·{" "}
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
                {logs.length === 0 && (
                  <p className="empty">Sin registros de auditoría.</p>
                )}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
