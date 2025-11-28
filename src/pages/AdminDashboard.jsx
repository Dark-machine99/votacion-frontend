// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAdminDashboard,
  getAdminElections,
  createElection,
  updateElection,
  deleteElection,
  getAdminCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getAdminUsers,
  getAdminAudit,
} from "../api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // modales
  const [electionModal, setElectionModal] = useState(null); // {mode:'create'|'edit', values:{...}}
  const [candidateModal, setCandidateModal] = useState(null); // {mode, values}

  async function refresh() {
    try {
      setLoading(true);
      if (tab === "dashboard") {
        setStats(await getAdminDashboard());
      } else if (tab === "elections") {
        setElections(await getAdminElections());
      } else if (tab === "candidates") {
        setCandidates(await getAdminCandidates());
      } else if (tab === "users") {
        setUsers(await getAdminUsers());
      } else if (tab === "audit") {
        setLogs(await getAdminAudit());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, [tab]);

  async function saveElection(values) {
    if (electionModal?.mode === "create") {
      await createElection(values);
    } else {
      await updateElection(electionModal.values.id, values);
    }
    setElectionModal(null);
    refresh();
  }

  async function saveCandidate(values) {
    if (candidateModal?.mode === "create") {
      await createCandidate(values);
    } else {
      await updateCandidate(candidateModal.values.id, values);
    }
    setCandidateModal(null);
    refresh();
  }

  return (
    <div className="gradient-bg min-h-screen p-8">
      <div className="card dashboard-card">
        <header className="dashboard-header">
          <div>
            <p className="subtitle">Panel de Administración</p>
            <h2 className="title">{user?.name || "Administrador"}</h2>
            <p className="small">Bienvenido, Administrador</p>
          </div>
          <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
        </header>

        <nav className="tabs">
          {["dashboard","elections","candidates","users","audit"].map((t)=>(
            <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
              {t==="dashboard"?"Dashboard":t==="elections"?"Votaciones":t==="candidates"?"Candidatos":t==="users"?"Usuarios":"Auditoría"}
            </button>
          ))}
        </nav>

        <main className="dashboard-content">
          {loading && <p className="small">Cargando...</p>}

          {/* DASHBOARD */}
          {tab==="dashboard" && stats && (
            <>
              <h3 className="section-title">Dashboard de Estadísticas</h3>
              <div className="grid grid-4">
                <div className="card stat-card"><p className="small">Total Usuarios</p><h2>{stats.totalUsers}</h2></div>
                <div className="card stat-card"><p className="small">Votaciones</p><h2>{stats.totalElections}</h2></div>
                <div className="card stat-card"><p className="small">Votos Emitidos</p><h2>{stats.totalVotes}</h2></div>
                <div className="card stat-card"><p className="small">Participación</p><h2>{Number(stats.participation||0).toFixed(1)}%</h2></div>
              </div>
            </>
          )}

          {/* ELECCIONES */}
          {tab==="elections" && !loading && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 className="section-title">Gestión de Votaciones</h3>
                <button className="btn-primary" onClick={()=>setElectionModal({mode:"create",values:{title:"",description:"",start_date:"",end_date:"",status:"Programada"}})}>
                  Nueva Votación
                </button>
              </div>
              <ul className="list">
                {elections.map((e)=>(
                  <li key={e.id} className="list-item list-item-card">
                    <div>
                      <strong>{e.title}</strong>
                      <p className="small">{e.description}</p>
                      <p className="small">{new Date(e.start_date).toLocaleDateString()} - {new Date(e.end_date).toLocaleDateString()}</p>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span className={`chip status-${e.status}`}>{e.status}</span>
                      <button className="btn-outline" onClick={()=>setElectionModal({mode:"edit",values:e})}>Editar</button>
                      <button className="btn-outline" onClick={async()=>{ if(confirm("¿Eliminar votación?")){ await deleteElection(e.id); refresh(); } }}>Eliminar</button>
                    </div>
                  </li>
                ))}
                {elections.length===0 && <p className="empty">No hay votaciones configuradas.</p>}
              </ul>
            </>
          )}

          {/* CANDIDATOS */}
          {tab==="candidates" && !loading && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <h3 className="section-title">Gestión de Candidatos</h3>
                <button className="btn-primary" onClick={()=>setCandidateModal({mode:"create",values:{election_id:"",name:"",party:"",bio:"",photo_url:""}})}>
                  Nuevo Candidato
                </button>
              </div>
              <div className="grid">
                {candidates.map((c)=>(
                  <div key={c.id} className="card candidate-card">
                    {c.photo_url && <div className="candidate-photo"><img src={c.photo_url} alt={c.name}/></div>}
                    <h4>{c.name}</h4>
                    <p className="small">{c.party}</p>
                    <p className="small">{c.bio}</p>
                    <p className="small">Elección: {c.election_title || c.election_id}</p>
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <button className="btn-outline" onClick={()=>setCandidateModal({mode:"edit",values:c})}>Editar</button>
                      <button className="btn-outline" onClick={async()=>{ if(confirm("¿Eliminar candidato?")){ await deleteCandidate(c.id); refresh(); }}}>Eliminar</button>
                    </div>
                  </div>
                ))}
                {candidates.length===0 && <p className="empty">No hay candidatos.</p>}
              </div>
            </>
          )}

          {/* USUARIOS */}
          {tab==="users" && !loading && (
            <>
              <h3 className="section-title">Gestión de Usuarios</h3>
              {users.length===0 ? <p className="empty">No hay usuarios.</p> : (
                <table className="table">
                  <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th></tr></thead>
                  <tbody>
                    {users.map((u)=>(
                      <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.active?"Activo":"Inactivo"}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {/* AUDITORÍA */}
          {tab==="audit" && !loading && (
            <>
              <h3 className="section-title">Registro de Auditoría</h3>
              <ul className="list">
                {logs.map((l)=>(
                  <li key={l.id} className="list-item list-item-card">
                    <div>
                      <strong>{l.action}</strong>
                      <p className="small">{l.description}</p>
                      <p className="small">{l.user_name || "Sistema"} · {new Date(l.created_at).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
                {logs.length===0 && <p className="empty">Sin registros.</p>}
              </ul>
            </>
          )}
        </main>
      </div>

      {/* Modal Elección */}
      {electionModal && (
        <Modal onClose={()=>setElectionModal(null)} title={electionModal.mode==="create"?"Nueva Votación":"Editar Votación"}>
          <ElectionForm
            initial={electionModal.values}
            onCancel={()=>setElectionModal(null)}
            onSubmit={saveElection}
          />
        </Modal>
      )}

      {/* Modal Candidato */}
      {candidateModal && (
        <Modal onClose={()=>setCandidateModal(null)} title={candidateModal.mode==="create"?"Nuevo Candidato":"Editar Candidato"}>
          <CandidateForm
            initial={candidateModal.values}
            onCancel={()=>setCandidateModal(null)}
            onSubmit={saveCandidate}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------- UI Helpers (modales + forms) ---------- */
function Modal({ children, onClose, title }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3 className="section-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ElectionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  function set(k, v) { setForm((f)=>({ ...f, [k]: v })); }

  return (
    <form className="form" onSubmit={(e)=>{ e.preventDefault(); onSubmit(form); }}>
      <label className="label">Título
        <input className="input" value={form.title} onChange={(e)=>set("title", e.target.value)} required/>
      </label>
      <label className="label">Descripción
        <textarea className="input" style={{height:90}} value={form.description} onChange={(e)=>set("description", e.target.value)} />
      </label>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <label className="label">Fecha inicio
          <input className="input" type="date" value={form.start_date?.slice(0,10) || ""} onChange={(e)=>set("start_date", e.target.value)} required/>
        </label>
        <label className="label">Fecha fin
          <input className="input" type="date" value={form.end_date?.slice(0,10) || ""} onChange={(e)=>set("end_date", e.target.value)} required/>
        </label>
      </div>
      <label className="label">Estado
        <select className="input" value={form.status} onChange={(e)=>set("status", e.target.value)}>
          <option>Programada</option>
          <option>Activa</option>
          <option>Finalizada</option>
        </select>
      </label>
      <div style={{display:"flex", gap:12}}>
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" type="submit">Guardar</button>
      </div>
    </form>
  );
}

function CandidateForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initial });
  function set(k, v) { setForm((f)=>({ ...f, [k]: v })); }

  return (
    <form className="form" onSubmit={(e)=>{ e.preventDefault(); onSubmit(form); }}>
      <label className="label">Elección (ID)
        <input className="input" value={form.election_id} onChange={(e)=>set("election_id", e.target.value)} required/>
      </label>
      <label className="label">Nombre
        <input className="input" value={form.name} onChange={(e)=>set("name", e.target.value)} required/>
      </label>
      <label className="label">Partido
        <input className="input" value={form.party} onChange={(e)=>set("party", e.target.value)} />
      </label>
      <label className="label">Biografía
        <textarea className="input" style={{height:90}} value={form.bio} onChange={(e)=>set("bio", e.target.value)} />
      </label>
      <label className="label">URL de foto
        <input className="input" value={form.photo_url} onChange={(e)=>set("photo_url", e.target.value)} />
      </label>
      <div style={{display:"flex", gap:12}}>
        <button type="button" className="btn-outline" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" type="submit">Guardar</button>
      </div>
    </form>
  );
}
