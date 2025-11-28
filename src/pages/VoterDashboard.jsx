import { useEffect, useState } from "react";
import { getVoterElections, getVoterHistory, getVoterPlaces } from "../api";
import { useAuth } from "../context/AuthContext";

export default function VoterDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("votar");
  const [elections, setElections] = useState([]);
  const [history, setHistory] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (tab === "votar") {
      getVoterElections().then(setElections).catch(console.error);
    } else if (tab === "historial") {
      getVoterHistory().then(setHistory).catch(console.error);
    } else if (tab === "lugares") {
      getVoterPlaces().then(setPlaces).catch(console.error);
    }
  }, [tab]);

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="card dashboard-card">
        <header className="dashboard-header">
          <div>
            <p className="subtitle">Bienvenido,</p>
            <h2 className="title">{user.name || "Usuario Demo"}</h2>
            <p className="small">Panel de votante</p>
          </div>
          <button className="btn-outline" onClick={logout}>
            Cerrar sesión
          </button>
        </header>

        <nav className="tabs">
          <button
            className={`tab ${tab === "votar" ? "active" : ""}`}
            onClick={() => setTab("votar")}
          >
            Votar
          </button>
          <button
            className={`tab ${tab === "historial" ? "active" : ""}`}
            onClick={() => setTab("historial")}
          >
            Historial
          </button>
          <button
            className={`tab ${tab === "lugares" ? "active" : ""}`}
            onClick={() => setTab("lugares")}
          >
            Lugares
          </button>
        </nav>

        <main className="dashboard-content">
          {tab === "votar" && (
            <>
              <h3 className="section-title">Votaciones Disponibles</h3>
              <p className="section-subtitle">
                Selecciona una votación para participar
              </p>
              <div className="grid">
                {elections.map((e) => (
                  <div key={e.id} className="card election-card">
                    <span className={`chip status-${e.status || "Activa"}`}>
                      {e.status || "Activa"}
                    </span>
                    <h4>{e.title}</h4>
                    <p className="small">{e.description}</p>
                    <p className="small">
                      Inicio: {new Date(e.start_date).toLocaleDateString()}
                    </p>
                    <p className="small">
                      Fin: {new Date(e.end_date).toLocaleDateString()}
                    </p>
                    <button className="btn-secondary">Votar ahora</button>
                  </div>
                ))}
                {elections.length === 0 && (
                  <p className="empty">No hay votaciones disponibles.</p>
                )}
              </div>
            </>
          )}

          {tab === "historial" && (
            <>
              <h3 className="section-title">Mi Historial de Votaciones</h3>
              {history.length === 0 ? (
                <div className="empty-card">
                  <p className="title">Sin historial</p>
                  <p className="small">
                    Aún no has participado en ninguna votación.
                  </p>
                </div>
              ) : (
                <ul className="list">
                  {history.map((v) => (
                    <li key={v.id} className="list-item">
                      <div>
                        <strong>{v.title}</strong>
                        <p className="small">
                          Votaste por {v.candidate} el{" "}
                          {new Date(v.created_at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {tab === "lugares" && (
            <>
              <h3 className="section-title">Lugares de Votación</h3>
              <p className="section-subtitle">
                Encuentra el centro más cercano a ti
              </p>
              <div className="grid">
                {places.map((p) => (
                  <div key={p.id} className="card place-card">
                    <span className="chip chip-success">Disponible</span>
                    <h4>{p.name}</h4>
                    <p className="small">{p.address}</p>
                    <p className="small">
                      Capacidad: {p.capacity} personas
                    </p>
                  </div>
                ))}
                {places.length === 0 && (
                  <p className="empty">No hay lugares configurados.</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
