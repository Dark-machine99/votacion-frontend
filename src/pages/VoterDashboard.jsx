// src/pages/VoterDashboard.jsx
import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ElectionsList from "../components/voter/ElectionsList";
import { getVoterHistory, getVoterPlaces } from "../api";

export default function VoterDashboard() {
  const [tab, setTab] = useState("votar");

  const [history, setHistory] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (tab === "historial") {
      getVoterHistory().then(setHistory).catch(console.error);
    }
    if (tab === "lugares") {
      getVoterPlaces().then(setPlaces).catch(console.error);
    }
  }, [tab]);

  return (
    <MainLayout title="Panel del Votante">
      {/* Tabs */}
      <div className="tabs">
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
      </div>

      {/* CONTENIDO */}
      <div className="dashboard-content">
        
        {/* =============================== */}
        {/* TAB 1: VOTAR */}
        {/* =============================== */}
        {tab === "votar" && (
          <ElectionsList />
        )}

        {/* =============================== */}
        {/* TAB 2: HISTORIAL */}
        {/* =============================== */}
        {tab === "historial" && (
          <>
            <h3 className="section-title">Mi Historial de Votaciones</h3>

            {history.length === 0 ? (
              <div className="empty-card">
                <p className="title">Sin historial</p>
                <p className="small">Aún no has votado.</p>
              </div>
            ) : (
              <ul className="list">
                {history.map((v) => (
                  <li key={v.id} className="list-item list-item-card">
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

        {/* =============================== */}
        {/* TAB 3: LUGARES */}
        {/* =============================== */}
        {tab === "lugares" && (
          <>
            <h3 className="section-title">Lugares de votación</h3>

            <div className="grid">
              {places.map((p) => (
                <div key={p.id} className="place-card">
                  <span className="chip chip-success">Disponible</span>
                  <h4>{p.name}</h4>
                  <p className="small">{p.address}</p>
                  <p className="small">Capacidad: {p.capacity} personas</p>
                </div>
              ))}

              {places.length === 0 && (
                <div className="empty-card">
                  <p className="empty">No hay lugares configurados</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
