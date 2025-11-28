// Normaliza la base URL para evitar errores
const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Quitar slash final si existe
const BASE = RAW_BASE.replace(/\/+$/, "");

// Si no incluye "/api", lo agregamos automáticamente
const API_URL = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

console.log("🔗 API_URL:", API_URL);

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Respuesta no JSON" };
  }

  if (!res.ok) throw new Error(data.message || "Error en la petición");

  return data;
}

/* ---------------- AUTH ---------------- */
export const login = (email, password) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerVoter = (name, email, password) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

/* ---------------- VOTER ---------------- */
export const getVoterElections = () => apiRequest("/voter/elections");
export const getElectionDetail = (id) => apiRequest(`/voter/elections/${id}`);
export const voteInElection = (electionId, candidateId) =>
  apiRequest(`/voter/elections/${electionId}/vote`, {
    method: "POST",
    body: JSON.stringify({ candidateId }),
  });

export const getVoterHistory = () => apiRequest("/voter/history");
export const getVoterPlaces = () => apiRequest("/voter/places");

/* ---------------- ADMIN ---------------- */
export const getAdminDashboard = () => apiRequest("/admin/dashboard");
export const getAdminElections = () => apiRequest("/admin/elections");

export const createElection = (payload) =>
  apiRequest("/admin/elections/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateElection = (id, payload) =>
  apiRequest(`/admin/elections/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteElection = (id) =>
  apiRequest(`/admin/elections/delete/${id}`, {
    method: "DELETE",
  });

export const getAdminCandidates = () => apiRequest("/admin/candidates");
export const createCandidate = (payload) =>
  apiRequest("/admin/candidates/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCandidate = (id, payload) =>
  apiRequest(`/admin/candidates/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteCandidate = (id) =>
  apiRequest(`/admin/candidates/delete/${id}`, {
    method: "DELETE",
  });

export const getAdminUsers = () => apiRequest("/admin/users");
export const getAdminAudit = () => apiRequest("/admin/audit");

export const createAdminUser = (name, email, password) =>
  apiRequest("/admin/create-admin", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
