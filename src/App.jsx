import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Dashboard from './components/Dashboard';
import Achievements from './components/Achievements';
import WelcomeScreen from './components/WelcomeScreen';
import InfoSection from './components/InfoSection';
import StepForm from './components/StepForm';
import SettingsPanel from './components/SettingsPanel';

import {
  Settings,
  Info,
  LayoutDashboard,
  Droplet,
  BarChart3,
  Trophy,
  Shield,
} from 'lucide-react';

import { Toaster, toast } from 'sonner';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

// Pages
import ProgressPage from './pages/ProgressPage';
import RankingPage from './pages/RankingPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { user, updateUser, logout, puedeVerPanelAdmin } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem('h2o_anonymous_id')) {
      localStorage.setItem('h2o_anonymous_id', crypto.randomUUID());
    }
  }, []);

  // Sincronizar usuario invitado antiguo (sin id) con API
  useEffect(() => {
    if (!user?.email || user.id) return;
    const email = user.email.endsWith('@puce.edu.ec') ? user.email : `${user.email}@puce.edu.ec`;
    api.usuarios.getByEmail(email)
      .then((u) => {
        const full = { ...user, id: u.id, role: u.role || 'user', permisos: u.permisos || [] };
        updateUser(full);
      })
      .catch(() => {});
  }, [user?.email, user?.id]);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('h2o_theme');
    return saved ? saved === 'dark' : false;
  });

  // Cargar historial cuando hay usuario con id
  useEffect(() => {
    if (!user?.id) return;
    setLoadingHistory(true);
    api.registros.getByUsuario(user.id)
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [user?.id]);


  const saveRecord = async (record) => {
    if (!user?.id) return;
    try {
      await api.registros.create({
        usuarioId: user.id,
        fecha: record.fecha,
        fechaISO: record.fechaISO,
        total: record.total,
        virtualTotal: record.virtualTotal,
        details: record.details,
      });
      setHistory((prev) => [record, ...prev].sort((a, b) => new Date(b.fechaISO) - new Date(a.fechaISO)));
      toast.info('Registro guardado correctamente', { description: `Consumo total: ${record.total} Litros.` });
      setIsFormOpen(false);
    } catch (err) {
      toast.error('Error al guardar', { description: err.message });
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      logout();
      window.location.reload();
    }
  };

  const handleClearHistory = () => {
    if (
      confirm(
        'Esto borrará únicamente el historial guardado en este navegador. ¿Continuar?'
      )
    ) {
      localStorage.removeItem('h2o_history');
      setHistory([]);
      toast.info('Historial local borrado correctamente');
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !user?.id ||
      !confirm(
        'Esta acción eliminará tu usuario y registros de la base de datos. ¿Estás seguro?'
      )
    ) {
      return;
    }

    try {
      await api.usuarios.delete(user.id);
      logout();
      toast.success('Cuenta eliminada correctamente');
      window.location.reload();
    } catch (err) {
      toast.error('No se pudo eliminar la cuenta', {
        description: err.message,
      });
    }
  };

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('h2o_theme', next ? 'dark' : 'light');
  };

  const handleUpdateProfile = async (changes) => {
    if (!user?.id) return;
    try {
      const updated = await api.usuarios.update(user.id, changes);
      updateUser(updated);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error('No se pudo actualizar el perfil', {
        description: err.message,
      });
    }
  };

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <div className={`${darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'} min-h-screen`}>
      <div className="max-w-6xl mx-auto p-4 md:p-10">
      <Toaster position="top-center" richColors closeButton />

      {/* NAVBAR */}
      <nav className={`flex justify-between items-center mb-10 p-4 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            WM
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-none capitalize">
              ¡Hola, {user.nombre}!
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              {user.email} • {user.edad} años
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* DASHBOARD */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsFormOpen(false);
            }}
            className={`p-2 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600 shadow-inner'
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={20} />
          </button>

          {/* PROGRESS */}
          <button
            onClick={() => {
              setActiveTab('progress');
              setIsFormOpen(false);
            }}
            className={`p-2 rounded-lg transition-all ${
              activeTab === 'progress'
                ? 'bg-blue-50 text-blue-600 shadow-inner'
                : 'text-slate-400 hover:bg-slate-50'
            }`}
            title="Progreso"
          >
            <BarChart3 size={20} />
          </button>

          {/* RANKING */}
          <button
            onClick={() => {
              setActiveTab('ranking');
              setIsFormOpen(false);
            }}
            className={`p-2 rounded-lg transition-all ${
              activeTab === 'ranking'
                ? 'bg-blue-50 text-blue-600 shadow-inner'
                : 'text-slate-400 hover:bg-slate-50'
            }`}
            title="Ranking"
          >
            <Trophy size={20} />
          </button>

          {/* ADMIN - solo visible con permiso */}
          {puedeVerPanelAdmin() && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsFormOpen(false);
              }}
              className={`p-2 rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-blue-50 text-blue-600 shadow-inner'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
              title="Panel administrador"
            >
              <Shield size={20} />
            </button>
          )}

          {/* INFO */}
          <button
            onClick={() => {
              setActiveTab('info');
              setIsFormOpen(false);
            }}
            className={`p-2 rounded-lg transition-all ${
              activeTab === 'info'
                ? 'bg-blue-50 text-blue-600 shadow-inner'
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Info size={20} />
          </button>

          {/* CONFIGURACIÓN */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-300 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
            title="Configuración"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="space-y-12">
        {activeTab === 'dashboard' && (
          <>
            {!isFormOpen ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                whileActive={{ scale: 0.99 }}
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white border-2 border-dashed border-blue-200 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all group"
              >
                <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform">
                  <Droplet size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-slate-800">
                    Realizar Análisis Diario
                  </h3>
                  <p className="text-slate-400 font-medium italic">
                    Basado en los parámetros de consumo PUCE
                  </p>
                </div>
              </motion.button>
            ) : (
              <StepForm
                onSave={saveRecord}
                onCancel={() => setIsFormOpen(false)}
              />
            )}

            <div className="pt-10 border-t border-slate-100">
              <Dashboard history={history} />
              <Achievements history={history} />
            </div>
          </>
        )}

        {activeTab === 'progress' && (
          <ProgressPage user={user} history={history} />
        )}

        {activeTab === 'ranking' && (
          <RankingPage user={user} history={history} />
        )}

        {activeTab === 'admin' && (
          <AdminPage />
        )}

        {activeTab === 'info' && (
          <InfoSection />
        )}
      </main>

      <footer className={`mt-20 pt-10 border-t text-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          WaterMarker • Proyecto Integrador PUCE 2026
        </p>
      </footer>
      </div>

      {isSettingsOpen && (
        <SettingsPanel
          user={user}
          darkMode={darkMode}
          onUpdateProfile={handleUpdateProfile}
          onToggleTheme={toggleTheme}
          onClearHistory={handleClearHistory}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
