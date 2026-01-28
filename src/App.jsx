import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Dashboard from './components/Dashboard';
import Achievements from './components/Achievements';
import WelcomeScreen from './components/WelcomeScreen';
import InfoSection from './components/InfoSection'; 
import StepForm from './components/StepForm'; 

import { Settings, Info, LayoutDashboard, Droplet } from 'lucide-react';
import { triggerConfetti } from './utils/celebration';
import { Toaster, toast } from 'sonner';

function App() {
  // 1. PERFIL DEL USUARIO
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('h2o_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 2. HISTORIAL (siempre lo tratamos como ordenado DESC por fecha)
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('h2o_history');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. NAVEGACIÓN
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 4. GUARDAR REGISTRO
// Dentro de App.jsx, reemplaza la función saveRecord por esta:
  const saveRecord = (record) => {
    const newHistory = [record, ...history].sort(
      (a, b) => new Date(b.fechaISO) - new Date(a.fechaISO)
    );

    setHistory(newHistory);
    localStorage.setItem('h2o_history', JSON.stringify(newHistory));

    // Solo un mensaje simple de guardado, los logros los maneja el otro componente
    toast.info('Registro guardado correctamente', {
      description: `Consumo total calculado: ${record.total} Litros.`,
    });

    setIsFormOpen(false);
  };


  const handleLogout = () => {
    if (
      confirm(
        '¿Estás seguro de resetear todos tus datos? Se borrará el perfil de la PUCE y el historial.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // PANTALLA DE BIENVENIDA
  if (!user) {
    return (
      <WelcomeScreen
        onComplete={(data) => {
          localStorage.setItem('h2o_user', JSON.stringify(data));
          setUser(data);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10">
      <Toaster position="top-center" richColors closeButton />

      {/* NAVBAR */}
      <nav className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            H2O
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-none capitalize">
              ¡Hola, {user.nombre}! 👋
            </h2>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
              {user.email} • {user.edad} años
            </span>
          </div>
        </div>

        <div className="flex gap-2">
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

          <button
            onClick={handleLogout}
            className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
            title="Resetear aplicación"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="space-y-12">
        {activeTab === 'dashboard' ? (
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
              <StepForm onSave={saveRecord} onCancel={() => setIsFormOpen(false)} />
            )}

            <div className="pt-10 border-t border-slate-100">
              <Dashboard history={history} />
              <Achievements history={history} />
            </div>
          </>
        ) : (
          <InfoSection />
        )}
      </main>

      <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          H2O.Impact • Proyecto Integrador PUCE 2026
        </p>
      </footer>
    </div>
  );
}

export default App;
