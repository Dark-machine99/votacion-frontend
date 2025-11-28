const API_URL = "http://localhost:4000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }

  return res.json();
}

export function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getVoterElections() {
  return apiRequest("/voter/elections");
}

export function getVoterHistory() {
  return apiRequest("/voter/history");
}

export function getVoterPlaces() {
  return apiRequest("/voter/places");
}

export function getAdminDashboard() {
  return apiRequest("/admin/dashboard");
}

export function getAdminElections() {
  return apiRequest("/admin/elections");
}

export function getAdminCandidates() {
  return apiRequest("/admin/candidates");
}

export function getAdminUsers() {
  return apiRequest("/admin/users");
}

export function getAdminAudit() {
  return apiRequest("/admin/audit");
}
