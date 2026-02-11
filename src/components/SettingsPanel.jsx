import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, LogOut, Moon, Sun, RefreshCcw, User as UserIcon, Save } from 'lucide-react';

export default function SettingsPanel({
  user,
  darkMode,
  onUpdateProfile,
  onToggleTheme,
  onClearHistory,
  onLogout,
  onDeleteAccount,
  onClose,
}) {
  const [nombre, setNombre] = useState(user?.nombre || '');

  const handleSaveProfile = () => {
    if (!nombre || !nombre.trim()) return;
    onUpdateProfile?.({ nombre: nombre.trim() });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Configuración de cuenta
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ajustes personales para tu experiencia en WaterMark
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
          >
            Cerrar
          </button>
        </div>

        {/* Perfil */}
        <section className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold uppercase">
            {nombre?.[0] || 'U'}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nombre visible
              </p>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <p className="text-xs text-slate-500">
              {user?.email} • {user?.edad} años
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Guardar cambios de perfil"
          >
            <Save size={18} />
          </button>
        </section>

        {/* Apariencia */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Apariencia
          </p>
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-yellow-300 flex items-center justify-center">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">
                  Modo {darkMode ? 'oscuro' : 'claro'}
                </p>
                <p className="text-xs text-slate-500">
                  Cambia el tema visual de la aplicación
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {darkMode ? 'Activo' : 'Desactivado'}
            </span>
          </button>
        </section>

        {/* Datos locales */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Datos en este dispositivo
          </p>
          <button
            type="button"
            onClick={onClearHistory}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100/80 text-blue-800 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <RefreshCcw size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">
                  Borrar solo historial local
                </p>
                <p className="text-xs">
                  Elimina los análisis guardados en este navegador
                </p>
              </div>
            </div>
          </button>
        </section>

        {/* Sesión y cuenta */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sesión y cuenta
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">
                  Cerrar sesión y limpiar datos
                </p>
                <p className="text-xs">
                  Borra tu sesión en este navegador y vuelve a la pantalla de inicio
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onDeleteAccount}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <Trash2 size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">
                  Eliminar cuenta definitivamente
                </p>
                <p className="text-xs">
                  Elimina tu usuario y registros de la base de datos
                </p>
              </div>
            </div>
          </button>
        </section>
      </motion.div>
    </div>
  );
}
