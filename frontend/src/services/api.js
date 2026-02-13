import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

let authToken = null;

export function setToken(t) {
  authToken = t;
  if (t) client.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  else delete client.defaults.headers.common['Authorization'];
}

async function handle(res) {
  return res.data;
}

function handleError(err) {
  const msg = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Request error';
  throw new Error(msg);
}

export const api = {
  health: () => client.get('/api/health').then(handle).catch(handleError),
  usuarios: {
    getAll: () => client.get('/api/usuarios').then(handle).catch(handleError),
    getById: (id) => client.get(`/api/usuarios/${id}`).then(handle).catch(handleError),
    getByEmail: (email) => client.get(`/api/usuarios/email/${encodeURIComponent(email)}`).then(handle).catch(handleError),
    create: (data) => client.post('/api/usuarios', data).then(handle).catch(handleError),
    update: (id, data) => client.put(`/api/usuarios/${id}`, data).then(handle).catch(handleError),
    delete: (id) => client.delete(`/api/usuarios/${id}`).then(handle).catch(handleError),
  },
  registros: {
    getByUsuario: (usuarioId) => client.get(`/api/registros/usuario/${usuarioId}`).then(handle).catch(handleError),
    getSemanales: (usuarioId) => client.get(`/api/registros/usuario/${usuarioId}/semanales`).then(handle).catch(handleError),
    create: (data) => client.post('/api/registros', data).then(handle).catch(handleError),
    delete: (id) => client.delete(`/api/registros/${id}`).then(handle).catch(handleError),
  },
  ranking: {
    get: () => client.get('/api/ranking').then(handle).catch(handleError),
    upsert: (data) => client.post('/api/ranking', data).then(handle).catch(handleError),
  },
  rachas: {
    getByUsuario: (usuarioId) => client.get(`/api/rachas/usuario/${usuarioId}`).then(handle).catch(handleError),
  },
  admin: {
    getSummary: () => client.get('/api/admin/summary').then(handle).catch(handleError),
    getUsuarios: () => client.get('/api/admin/usuarios').then(handle).catch(handleError),
    cambiarRol: (id, payload) =>
      client.patch(`/api/admin/usuarios/${id}/role`, typeof payload === 'object' ? payload : { role: payload }).then(handle).catch(handleError),
    asignarPermisos: (id, permisos) =>
      client.patch(`/api/admin/usuarios/${id}/permisos`, { permisos }).then(handle).catch(handleError),
    getPermisosCatalogo: () => client.get('/api/admin/permisos-catalogo').then(handle).catch(handleError),
    createPermiso: (data) =>
      client.post('/api/admin/permisos-catalogo', data).then(handle).catch(handleError),
    updatePermiso: (id, data) =>
      client.put(`/api/admin/permisos-catalogo/${id}`, data).then(handle).catch(handleError),
    deletePermiso: (id) =>
      client.delete(`/api/admin/permisos-catalogo/${id}`).then(handle).catch(handleError),
    getRoles: () => client.get('/api/admin/roles').then(handle).catch(handleError),
    createRole: (data) =>
      client.post('/api/admin/roles', data).then(handle).catch(handleError),
    updateRole: (id, data) =>
      client.put(`/api/admin/roles/${id}`, data).then(handle).catch(handleError),
    deleteRole: (id) =>
      client.delete(`/api/admin/roles/${id}`).then(handle).catch(handleError),
  },
  auth: {
    login: (email, password) => client.post('/api/auth/login', { email, password }).then(handle).catch(handleError),
    register: (data) => client.post('/api/auth/register', data).then(handle).catch(handleError),
    me: () => client.get('/api/auth/me').then(handle).catch(handleError),
  },
};

export default api;