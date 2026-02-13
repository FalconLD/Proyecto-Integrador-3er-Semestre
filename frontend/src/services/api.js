const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let authToken = null;

function getHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;
  return h;
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || `Error ${res.status}`);
  return data;
}

export const api = {
  health: () => request('/api/health'),
  usuarios: {
    getAll: () => request('/api/usuarios'),
    getById: (id) => request(`/api/usuarios/${id}`),
    getByEmail: (email) => request(`/api/usuarios/email/${encodeURIComponent(email)}`),
    create: (data) => request('/api/usuarios', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/usuarios/${id}`, { method: 'DELETE' }),
  },
  registros: {
    getByUsuario: (usuarioId) => request(`/api/registros/usuario/${usuarioId}`),
    getSemanales: (usuarioId) => request(`/api/registros/usuario/${usuarioId}/semanales`),
    create: (data) => request('/api/registros', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => request(`/api/registros/${id}`, { method: 'DELETE' }),
  },
  ranking: {
    get: () => request('/api/ranking'),
    upsert: (data) => request('/api/ranking', { method: 'POST', body: JSON.stringify(data) }),
  },
  rachas: {
    getByUsuario: (usuarioId) => request(`/api/rachas/usuario/${usuarioId}`),
  },
  admin: {
    getSummary: () => request('/api/admin/summary'),
    getUsuarios: () => request('/api/admin/usuarios'),
    cambiarRol: (id, payload) =>
      request(`/api/admin/usuarios/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify(typeof payload === 'object' ? payload : { role: payload }),
      }),
    asignarPermisos: (id, permisos) =>
      request(`/api/admin/usuarios/${id}/permisos`, {
        method: 'PATCH',
        body: JSON.stringify({ permisos }),
      }),
    getPermisosCatalogo: () => request('/api/admin/permisos-catalogo'),
    createPermiso: (data) =>
      request('/api/admin/permisos-catalogo', { method: 'POST', body: JSON.stringify(data) }),
    updatePermiso: (id, data) =>
      request(`/api/admin/permisos-catalogo/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePermiso: (id) =>
      request(`/api/admin/permisos-catalogo/${id}`, { method: 'DELETE' }),
    getRoles: () => request('/api/admin/roles'),
    createRole: (data) =>
      request('/api/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
    updateRole: (id, data) =>
      request(`/api/admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRole: (id) =>
      request(`/api/admin/roles/${id}`, { method: 'DELETE' }),
  },
  auth: {
    login: (email, password) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => request('/api/auth/me'),
  },
  setToken: (t) => {
    authToken = t;
  },
};
