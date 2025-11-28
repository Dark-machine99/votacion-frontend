// src/pages/VoterDashboard.jsx
import { useEffect, useState } from "react";
import {
  getVoterElections,
  getVoterHistory,
  getVoterPlaces,
  getElectionDetail,
  voteInElection,
} from "../api";
import { useAuth } from "../context/AuthContext";

export default function VoterDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("votar");
  const [elections, setElections] = useState([]);
  const [history, setHistory] = useState([]);
  const [places, setPlaces] = useState([]);
  const [modal, setModal] = useState(null); // { election, candidates }

  useEffect(() => {
    if (tab === "votar") getVoterElections().then(setElections).catch(console.error);
    if (tab === "historial") getVoterHistory().then(setHistory).catch(console.error);
    if (tab === "lugares") getVoterPlaces().then(setPlaces).catch(console.error);
  }, [tab]);

  async function openVoteModal(electionId) {
    const detail = await getElectionDetail(electionId);
    setModal({ election: detail.election, candidates: detail.candidates, selected: null, sending: false, ok: false, error: "" });
  }

  async function confirmVote() {
    if (!modal?.selected) return;
    try {
      setModal((m) => ({ ...m, sending: true, error: "" }));
      await voteInElection(modal.election.id, modal.selected);
      setModal((m) => ({ ...m, ok: true, sending: false }));
    } catch (err) {
      setModal((m) => ({ ...m, error: err.message, sending: false }));
    }
  }

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="card dashboard-card">
        <header className="dashboard-header">
          <div>
            <p className="subtitle">Bienvenido,</p>
            <h2 className="title">{user?.name || "Usuario"}</h2>
            <p className="small">Panel de votante</p>
          </div>
          <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
        </header>

        <nav className="tabs">
          <button className={`tab ${tab === "votar" ? "active" : ""}`} onClick={() => setTab("votar")}>Votar</button>
          <button className={`tab ${tab === "historial" ? "active" : ""}`} onClick={() => setTab("historial")}>Historial</button>
          <button className={`tab ${tab === "lugares" ? "active" : ""}`} onClick={() => setTab("lugares")}>Lugares</button>
        </nav>

        <main className="dashboard-content">
          {tab === "votar" && (
            <>
              <h3 className="section-title">Votaciones Disponibles</h3>
              <div className="grid">
                {elections.map((e) => (
                  <div key={e.id} className="card election-card">
                    <span className={`chip status-${e.status}`}>{e.status}</span>
                    <h4>{e.title}</h4>
                    <p className="small">{e.description}</p>
                    <p className="small">Inicio: {new Date(e.start_date).toLocaleDateString()}</p>
                    <p className="small">Fin: {new Date(e.end_date).toLocaleDateString()}</p>
                    <button className="btn-secondary" onClick={() => openVoteModal(e.id)}>Votar ahora</button>
                  </div>
                ))}
                {elections.length === 0 && <p className="empty">No hay votaciones disponibles.</p>}
              </div>
            </>
          )}

          {tab === "historial" && (
            <>
              <h3 className="section-title">Mi Historial de Votaciones</h3>
              {history.length === 0 ? (
                <div className="empty-card">
                  <p className="title">Sin historial</p>
                  <p className="small">Aún no has participado en ninguna votación.</p>
                </div>
              ) : (
                <ul className="list">
                  {history.map((v) => (
                    <li key={v.id} className="list-item list-item-card">
                      <div>
                        <strong>{v.title}</strong>
                        <p className="small">Votaste por {v.candidate} el {new Date(v.created_at).toLocaleString()}</p>
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
              <div className="grid">
                {places.map((p) => (
                  <div key={p.id} className="card place-card">
                    <span className="chip chip-success">Disponible</span>
                    <h4>{p.name}</h4>
                    <p className="small">{p.address}</p>
                    <p className="small">Capacidad: {p.capacity} personas</p>
                  </div>
                ))}
                {places.length === 0 && <p className="empty">No hay lugares configurados.</p>}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal votar */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {!modal.ok ? (
              <>
                <h3 className="section-title">{modal.election.title}</h3>
                <p className="small">Selecciona tu candidato</p>
                <div className="grid">
                  {modal.candidates.map((c) => (
                    <div
                      key={c.id}
                      className="card candidate-card"
                      style={{
                        border: modal.selected === c.id ? "2px solid #fff" : "2px solid transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => setModal((m) => ({ ...m, selected: c.id }))}
                    >
                      {c.photo_url && (
                        <div className="candidate-photo">
                          <img src={c.photo_url} alt={c.name} />
                        </div>
                      )}
                      <h4>{c.name}</h4>
                      <p className="small">{c.party}</p>
                      <p className="small">{c.bio}</p>
                    </div>
                  ))}
                </div>

                {modal.error && <div className="error" style={{ marginTop: 12 }}>{modal.error}</div>}

                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button className="btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                  <button className="btn-primary" onClick={confirmVote} disabled={!modal.selected || modal.sending}>
                    {modal.sending ? "Enviando..." : "Confirmar Voto"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <h3 className="section-title">¡Voto Registrado!</h3>
                <p className="small">Tu voto ha sido registrado exitosamente.</p>
                <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setModal(null)}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
