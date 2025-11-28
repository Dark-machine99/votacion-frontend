// src/components/voter/ElectionsList.jsx
import { useEffect, useState } from "react";
import {
  getVoterElections,
  getElectionDetail,
  voteInElection,
} from "../../api";
import { toast } from "react-toastify";

export default function ElectionsList() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentElection, setCurrentElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getVoterElections();
        setElections(data);
      } catch (e) {
        toast.error(e.message || "Error cargando elecciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openElection = async (electionId) => {
    try {
      const data = await getElectionDetail(electionId);
      setCurrentElection(data.election);
      setCandidates(data.candidates || []);
      setSelectedCandidate(null);
      setModalOpen(true);
    } catch (e) {
      toast.error(e.message || "No se pudo abrir la elección");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentElection(null);
    setCandidates([]);
    setSelectedCandidate(null);
  };

  const submitVote = async () => {
    if (!selectedCandidate) return toast.info("Selecciona un candidato");
    setSending(true);
    try {
      await voteInElection(currentElection.id, selectedCandidate);
      toast.success("¡Voto registrado correctamente!");
      closeModal();
    } catch (e) {
      toast.error(e.message || "No se pudo registrar el voto");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="small">Cargando elecciones...</p>;

  return (
    <>
      <h3 className="section-title">Votaciones disponibles</h3>
      <p className="section-subtitle">
        Elige una elección para revisar a sus candidatos
      </p>

      <div className="grid">
        {elections.map((el) => (
          <div key={el.id} className="election-card">
            <span className={`chip status-${el.status}`} style={{ marginBottom: 8 }}>
              {el.status}
            </span>
            <h4 style={{ margin: "0 0 .25rem" }}>{el.title}</h4>
            <p className="small" style={{ margin: 0, opacity: 0.9 }}>
              {el.description}
            </p>
            <p className="small" style={{ marginTop: 8, opacity: 0.8 }}>
              Inicio: {new Date(el.start_date).toLocaleDateString()} • Fin:{" "}
              {new Date(el.end_date).toLocaleDateString()}
            </p>

            <div style={{ display: "flex", gap: ".5rem", marginTop: 8 }}>
              <button className="btn-secondary" onClick={() => openElection(el.id)}>
                Ver candidatos
              </button>
              <button
                className="btn-outline"
                onClick={() => openElection(el.id)}
                disabled={el.status !== "Activa"}
                title={
                  el.status !== "Activa"
                    ? "Esta elección no está activa"
                    : "Votar ahora"
                }
              >
                {el.status === "Activa" ? "Votar" : "No disponible"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de elección */}
      {modalOpen && currentElection && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginTop: 0 }}>{currentElection.title}</h4>
            <p className="small" style={{ marginTop: 0, opacity: 0.9 }}>
              {currentElection.description}
            </p>

            <div className="grid" style={{ marginTop: ".8rem" }}>
              {candidates.length === 0 && (
                <div className="empty-card">
                  <p className="empty">No hay candidatos registrados aún</p>
                </div>
              )}

              {candidates.map((c) => (
                <label
                  key={c.id}
                  className="candidate-card"
                  style={{
                    border:
                      selectedCandidate === c.id
                        ? "2px solid rgba(255,255,255,.6)"
                        : "2px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedCandidate(c.id)}
                >
                  <div className="candidate-photo">
                    <img src={c.photo_url || "/vite.svg"} alt={c.name} />
                  </div>
                  <strong>{c.name}</strong>
                  <p className="small" style={{ margin: ".2rem 0" }}>
                    {c.party || "Independiente"}
                  </p>
                  <p className="small" style={{ opacity: 0.85 }}>
                    {c.bio || "Sin biografía"}
                  </p>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
              <button className="btn-outline" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={submitVote}
                disabled={
                  !selectedCandidate || sending || currentElection.status !== "Activa"
                }
                title={
                  currentElection.status !== "Activa"
                    ? "La elección no está activa"
                    : undefined
                }
              >
                {sending ? "Enviando..." : "Confirmar voto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
