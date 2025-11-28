// src/pages/AdminDashboard.jsx
import MainLayout from "../components/layout/MainLayout";
import StatsCards from "../components/admin/StatsCards";
import {
  getAdminDashboard,
  getAdminElections,
  getAdminCandidates,
  getAdminUsers,
  getAdminAudit,
  createElection,
  updateElection,
  deleteElection,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  setUserStatus,
} from "../api";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

  const [stats, setStats] = useState({ totalUsers: 0, totalElections: 0, totalVotes: 0, participation: 0 });
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);

  const [modalElection, setModalElection] = useState(null); // {mode:'create'|'edit', data:{}}
  const [modalCandidate, setModalCandidate] = useState(null);

  const refresh = async () => {
    const [s, es, cs, us, au] = await Promise.all([
      getAdminDashboard(), getAdminElections(), getAdminCandidates(), getAdminUsers(), getAdminAudit()
    ]);
    setStats(s); setElections(es); setCandidates(cs); setUsers(us); setAudit(au);
  };

  useEffect(() => { refresh(); }, []);

  const votesDistribution = useMemo(() => {
    const labels = elections.map(e => e.title.slice(0,16));
    const data = elections.map(e => (e.status === "Activa" ? 1 : e.status === "Programada" ? .5 : 0));
    return { labels, data };
  }, [elections]);

  const submitElection = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      if (modalElection.mode === "create") {
        await createElection(payload);
        toast.success("Elección creada");
      } else {
        await updateElection(modalElection.data.id, payload);
        toast.success("Elección actualizada");
      }
      setModalElection(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeElection = async (id) => {
    if (!confirm("¿Eliminar elección?")) return;
    await deleteElection(id);
    toast.success("Elección eliminada");
    refresh();
  };

  const submitCandidate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.election_id = Number(payload.election_id);
    try {
      if (modalCandidate.mode === "create") {
        await createCandidate(payload);
        toast.success("Candidato creado");
      } else {
        await updateCandidate(modalCandidate.data.id, payload);
        toast.success("Candidato actualizado");
      }
      setModalCandidate(null);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removeCandidate = async (id) => {
    if (!confirm("¿Eliminar candidato?")) return;
    await deleteCandidate(id);
    toast.success("Candidato eliminado");
    refresh();
  };

  const toggleUser = async (u) => {
    await setUserStatus(u.id, !u.active);
    toast.success("Estado actualizado");
    refresh();
  };

  return (
    <MainLayout title="Panel de Administración">
      <div className="tabs">
        <button className={`tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={`tab ${tab === "elections" ? "active" : ""}`} onClick={() => setTab("elections")}>Votaciones</button>
        <button className={`tab ${tab === "candidates" ? "active" : ""}`} onClick={() => setTab("candidates")}>Candidatos</button>
        <button className={`tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>Usuarios</button>
        <button className={`tab ${tab === "audit" ? "active" : ""}`} onClick={() => setTab("audit")}>Auditoría</button>
      </div>

      {tab === "dashboard" && (
        <>
          <StatsCards stats={stats} elections={elections} votesDistribution={votesDistribution} />
          <div className="empty-card" style={{ marginTop: "1rem" }}>
            <p className="small">Sistema en vivo — los datos se actualizan automáticamente</p>
          </div>
        </>
      )}

      {tab === "elections" && (
        <>
          <div className="dashboard-header">
            <div>
              <h3 className="section-title">Gestión de Votaciones</h3>
              <p className="section-subtitle">Administra las votaciones del sistema</p>
            </div>
            <button className="btn-primary" onClick={() => setModalElection({ mode: "create", data: {} })}>
              Nueva Votación
            </button>
          </div>

          <ul className="list">
            {elections.map((e) => (
              <li key={e.id} className="list-item list-item-card">
                <div>
                  <span className={`chip status-${e.status}`}>{e.status}</span>{" "}
                  <strong>{e.title}</strong>
                  <div className="small">{e.description}</div>
                  <div className="small">Inicio: {e.start_date} • Fin: {e.end_date}</div>
                </div>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <button className="btn-outline" onClick={() => setModalElection({ mode: "edit", data: e })}>Editar</button>
                  <button className="btn-outline" onClick={() => removeElection(e.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "candidates" && (
        <>
          <div className="dashboard-header">
            <div>
              <h3 className="section-title">Gestión de Candidatos</h3>
              <p className="section-subtitle">Administra los candidatos del sistema</p>
            </div>
            <button className="btn-primary" onClick={() => setModalCandidate({ mode: "create", data: {} })}>
              Nuevo Candidato
            </button>
          </div>

          <div className="grid">
            {candidates.map((c) => (
              <div key={c.id} className="candidate-card">
                <div className="candidate-photo"><img src={c.photo_url || "/vite.svg"} alt={c.name} /></div>
                <strong>{c.name}</strong>
                <p className="small" style={{ margin: ".2rem 0" }}>{c.party || "Independiente"}</p>
                <p className="small" style={{ opacity: .85 }}>{c.bio}</p>
                <div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>
                  <button className="btn-outline" onClick={() => setModalCandidate({ mode: "edit", data: c })}>Editar</button>
                  <button className="btn-outline" onClick={() => removeCandidate(c.id)}>Eliminar</button>
                </div>
                <p className="small" style={{ opacity: .7, marginTop: ".4rem" }}>
                  Elección: {c.election_title || c.election_id}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "users" && (
        <>
          <h3 className="section-title">Gestión de Usuarios</h3>
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Vigente</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button className="btn-outline" onClick={() => toggleUser(u)}>
                      {u.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "audit" && (
        <>
          <h3 className="section-title">Registro de Auditoría</h3>
          <ul className="list">
            {audit.map((a) => (
              <li key={a.id} className="list-item list-item-card">
                <div>
                  <strong>{a.action}</strong>
                  <div className="small">{a.description}</div>
                </div>
                <div className="small" style={{ textAlign: "right" }}>
                  <div>{a.user_name || "Sistema"}</div>
                  <div>{new Date(a.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* MODALES */}
      {modalElection && (
        <div className="modal-backdrop" onClick={() => setModalElection(null)}>
          <form className="modal" onSubmit={submitElection} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginTop: 0 }}>{modalElection.mode === "create" ? "Nueva Votación" : "Editar Votación"}</h4>
            <input className="input" name="title" placeholder="Título" defaultValue={modalElection?.data?.title || ""} required />
            <input className="input" name="description" placeholder="Descripción" defaultValue={modalElection?.data?.description || ""} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
              <input className="input" type="date" name="start_date" defaultValue={modalElection?.data?.start_date || ""} required />
              <input className="input" type="date" name="end_date" defaultValue={modalElection?.data?.end_date || ""} required />
            </div>
            <select className="input" name="status" defaultValue={modalElection?.data?.status || "Programada"}>
              <option>Activa</option>
              <option>Programada</option>
              <option>Finalizada</option>
            </select>
            <div style={{ display: "flex", gap: ".5rem", marginTop: ".4rem" }}>
              <button type="button" className="btn-outline" onClick={() => setModalElection(null)}>Cancelar</button>
              <button className="btn-primary">{modalElection.mode === "create" ? "Crear" : "Actualizar"}</button>
            </div>
          </form>
        </div>
      )}

      {modalCandidate && (
        <div className="modal-backdrop" onClick={() => setModalCandidate(null)}>
          <form className="modal" onSubmit={submitCandidate} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ marginTop: 0 }}>{modalCandidate.mode === "create" ? "Nuevo Candidato" : "Editar Candidato"}</h4>
            <select className="input" name="election_id" defaultValue={modalCandidate?.data?.election_id || ""} required>
              <option value="" disabled>Selecciona elección</option>
              {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <input className="input" name="name" placeholder="Nombre" defaultValue={modalCandidate?.data?.name || ""} required />
            <input className="input" name="party" placeholder="Partido/Movimiento" defaultValue={modalCandidate?.data?.party || ""} />
            <input className="input" name="photo_url" placeholder="URL Foto" defaultValue={modalCandidate?.data?.photo_url || ""} />
            <textarea className="input" name="bio" placeholder="Biografía" defaultValue={modalCandidate?.data?.bio || ""} rows={3} />
            <div style={{ display: "flex", gap: ".5rem", marginTop: ".4rem" }}>
              <button type="button" className="btn-outline" onClick={() => setModalCandidate(null)}>Cancelar</button>
              <button className="btn-primary">{modalCandidate.mode === "create" ? "Crear" : "Actualizar"}</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
}
