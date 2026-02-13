import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Key, List, Users, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RUTAS_ADMIN, puedeAccederRuta } from '../config/rutasAdmin';

/**
 * Layout exclusivo del panel admin. No reutiliza el layout de la app principal.
 * Navegación lateral según permisos del usuario.
 */
export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSalir = () => {
    logout();
    navigate('/', { replace: true });
  };

  const enlacesVisibles = RUTAS_ADMIN.filter((r) => puedeAccederRuta(user, r));

  return (
    <div className="admin-layout flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <h1 className="font-bold text-sky-200">Panel Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">H2O • PUCE</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {enlacesVisibles.map((ruta) => (
            <NavLink
              key={ruta.path}
              to={ruta.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {ruta.path === '/admin' && <BarChart3 size={18} />}
              {ruta.path === '/admin/permisos' && <Key size={18} />}
              {ruta.path === '/admin/roles' && <List size={18} />}
              {ruta.path === '/admin/usuarios' && <Users size={18} />}
              {!['/admin', '/admin/permisos', '/admin/roles', '/admin/usuarios'].includes(ruta.path) && (
                <LayoutDashboard size={18} />
              )}
              {ruta.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700">
          <button
            type="button"
            onClick={handleSalir}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <LogOut size={18} /> Salir al inicio
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
