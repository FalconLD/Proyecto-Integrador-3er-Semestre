/**
 * Rutas del panel admin y permisos requeridos.
 * Navegación dinámica: solo se muestran enlaces para los que el usuario tenga permiso.
 */
import { PERMISOS } from '../../config/permisos';

export const RUTAS_ADMIN = [
  {
    path: '/admin',
    label: 'Resumen',
    permission: PERMISOS.ADMIN_VER_PANEL,
    permissionAlt: PERMISOS.ADMIN_VER_ESTADISTICAS,
  },
  {
    path: '/admin/permisos',
    label: 'Permisos',
    permission: PERMISOS.USUARIOS_ASIGNAR_PERMISOS,
  },
  {
    path: '/admin/roles',
    label: 'Roles',
    permission: PERMISOS.ADMIN_VER_PANEL,
  },
  {
    path: '/admin/usuarios',
    label: 'Usuarios',
    permission: PERMISOS.USUARIOS_LISTAR,
  },
];

/**
 * Comprueba si el usuario puede acceder a una ruta según sus permisos.
 */
export function puedeAccederRuta(user, ruta) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'Administrador') return true;
  const permisos = Array.isArray(user.permisos) ? user.permisos : [];
  if (ruta.permission && permisos.includes(ruta.permission)) return true;
  if (ruta.permissionAlt && permisos.includes(ruta.permissionAlt)) return true;
  return false;
}
