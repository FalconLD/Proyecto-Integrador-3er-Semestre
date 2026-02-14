import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Dashboard from './components/Dashboard';
import Achievements from './components/Achievements';
import WelcomeScreen from './components/WelcomeScreen';
import InfoSection from './components/InfoSection';
import StepForm from './components/StepForm';
import SettingsPanel from './components/SettingsPanel';
import ConfirmModal from './components/ConfirmModal';

import {
  Settings,
  Info,
  LayoutDashboard,
  Droplet,
  BarChart3,
  Trophy,
  Shield,
  Loader,
} from 'lucide-react';

import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

// Pages (AdminPage se monta en /admin vía router)
import ProgressPage from './pages/ProgressPage';
import RankingPage from './pages/RankingPage';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, logout, puedeVerPanelAdmin } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem('h2o_anonymous_id')) {
      localStorage.setItem('h2o_anonymous_id', crypto.randomUUID());
    }
  }, []);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const p = location.pathname;
    if (p === '/progress') return 'progress';
    if (p === '/ranking') return 'ranking';
    if (p === '/info') return 'info';
    return 'dashboard';
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('h2o_theme');
    return saved ? saved === 'dark' : false;
  });
  const [confirmModal, setConfirmModal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sincronizar pestaña con URL (deep links /progress, /ranking, /info)
  useEffect(() => {
    const p = location.pathname;
    if (p === '/progress') setActiveTab('progress');
    else if (p === '/ranking') setActiveTab('ranking');
    else if (p === '/info') setActiveTab('info');
    else if (p === '/') setActiveTab('dashboard');
  }, [location.pathname]);

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
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = () => {
    setConfirmModal({ type: 'logout' });
  };

  const handleDeleteRegistroClick = (id) => {
    if (!id) return;
    setConfirmModal({ type: 'deleteRegistro', payload: id });
  };

  const handleClearHistoryClick = () => {
    setConfirmModal({ type: 'clearHistory' });
  };

  const handleDeleteAccountClick = () => {
    if (!user?.id) return;
    setConfirmModal({ type: 'deleteAccount' });
  };

  const handleConfirmModalConfirm = () => {
    const m = confirmModal;
    if (!m) return;
    if (m.type === 'logout') {
      logout();
      window.location.reload();
      return;
    }
    if (m.type === 'clearHistory') {
      localStorage.removeItem('h2o_history');
      setHistory([]);
      toast.info('Historial local borrado correctamente');
      return;
    }
    if (m.type === 'deleteRegistro') {
      api.registros.delete(m.payload)
        .then(() => {
          setHistory((prev) => prev.filter((r) => r.id !== m.payload));
          toast.success('Registro eliminado correctamente');
        })
        .catch((err) => toast.error('No se pudo eliminar el registro', { description: err.message }));
      return;
    }
    if (m.type === 'deleteAccount') {
      api.usuarios.delete(user.id)
        .then(() => {
          logout();
          toast.success('Cuenta eliminada correctamente');
          window.location.reload();
        })
        .catch((err) => toast.error('No se pudo eliminar la cuenta', { description: err.message }));
    }
  };

  const confirmModalConfig = {
    logout: { title: 'Cerrar sesión', message: '¿Estás seguro de cerrar sesión?', confirmLabel: 'Cerrar sesión', variant: 'default' },
    deleteRegistro: { title: 'Eliminar registro', message: '¿Eliminar este registro de consumo? Esta acción no se puede deshacer.', confirmLabel: 'Eliminar', variant: 'danger' },
    clearHistory: { title: 'Borrar historial local', message: 'Esto borrará únicamente el historial guardado en este navegador. ¿Continuar?', confirmLabel: 'Continuar', variant: 'default' },
    deleteAccount: { title: 'Eliminar cuenta', message: 'Esta acción eliminará tu usuario y registros de la base de datos. ¿Estás seguro?', confirmLabel: 'Eliminar cuenta', variant: 'danger' },
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

  // Usuario admin: ir directo al panel, no mostrar vista de usuario (calculadora, progreso, ranking)
  if (puedeVerPanelAdmin() && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
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
            <h2 className={`text-sm font-bold leading-none capitalize ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              ¡Hola, {user?.nombre ?? 'Usuario'}!
            </h2>
            <span className={`text-xs uppercase tracking-wider font-medium ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
              {user?.email ?? ''} {user?.edad != null ? `• ${user.edad} años` : ''}
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
            title="Inicio"
            aria-label="Inicio"
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
            aria-label="Progreso"
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
            aria-label="Ranking"
          >
            <Trophy size={20} />
          </button>

          {/* ADMIN - solo visible con permiso */}
          {puedeVerPanelAdmin() && (
            <button
              onClick={() => {
                setIsFormOpen(false);
                navigate('/admin');
              }}
              className="p-2 rounded-lg transition-all text-slate-400 hover:bg-slate-50 hover:text-blue-600"
              title="Panel administrador"
              aria-label="Panel administrador"
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
            title="Información"
            aria-label="Información"
          >
            <Info size={20} />
          </button>

          {/* CONFIGURACIÓN */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-300 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
            title="Configuración"
            aria-label="Configuración"
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
                saving={saving}
              />
            )}

            <div className="pt-10 border-t border-slate-100">
              {loadingHistory && history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader className="animate-spin text-blue-600" size={48} />
                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Cargando tu historial…</p>
                </div>
              ) : (
                <>
                  <Dashboard history={history} onDeleteRegistro={handleDeleteRegistroClick} />
                  <Achievements history={history} />
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'progress' && (
          <ProgressPage
            user={user}
            history={history}
            loadingHistory={loadingHistory}
            onGoToDashboard={() => {
              setActiveTab('dashboard');
              setIsFormOpen(true);
            }}
          />
        )}

        {activeTab === 'ranking' && (
          <RankingPage user={user} history={history} />
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

      {confirmModal && (
        <ConfirmModal
          open={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirmModalConfirm}
          title={confirmModalConfig[confirmModal.type]?.title}
          message={confirmModalConfig[confirmModal.type]?.message}
          confirmLabel={confirmModalConfig[confirmModal.type]?.confirmLabel}
          variant={confirmModalConfig[confirmModal.type]?.variant}
        />
      )}
      {isSettingsOpen && (
        <SettingsPanel
          user={user}
          darkMode={darkMode}
          onUpdateProfile={handleUpdateProfile}
          onToggleTheme={toggleTheme}
          onClearHistory={handleClearHistoryClick}
          onLogoutClick={handleLogoutClick}
          onDeleteAccountClick={handleDeleteAccountClick}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
