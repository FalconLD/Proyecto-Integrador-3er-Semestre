import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PERMISOS } from '../../config/permisos';

/**
 * Guard para rutas /admin: exige usuario autenticado y permiso de ver panel.
 * Redirige a / si no hay usuario o no tiene permiso.
 */
export function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const puedeVerPanel =
    user.role === 'admin' ||
    user.role === 'Administrador' ||
    (Array.isArray(user.permisos) && user.permisos.includes(PERMISOS.ADMIN_VER_PANEL)) ||
    (Array.isArray(user.permisos) && user.permisos.includes(PERMISOS.ADMIN_VER_ESTADISTICAS));

  if (!puedeVerPanel) {
    return <Navigate to="/" replace />;
  }

  return children;
}
