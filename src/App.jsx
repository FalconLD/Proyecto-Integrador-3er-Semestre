import React, { useState, useEffect } from 'react';
// Importamos los componentes que creamos en los pasos anteriores
import Calculator from './components/Calculator';
import Dashboard from './components/Dashboard';
import Achievements from './components/Achievements';

function App() {
  // 1. ESTADO: Aquí vive la información. 
  // Si 'history' cambia, React redibuja automáticamente todo lo visual.
  const [history, setHistory] = useState(() => {
    // Leemos el historial guardado al cargar la app por primera vez
    const saved = localStorage.getItem('h2o_history');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. FUNCIÓN PARA GUARDAR: Se la pasamos a la Calculadora
  const saveRecord = (record) => {
    // Creamos un nuevo historial poniendo el registro nuevo al principio
    const newHistory = [record, ...history];
    setHistory(newHistory);
    // Lo hacemos persistente en el navegador
    localStorage.setItem('h2o_history', JSON.stringify(newHistory));
  };

  return (
    // Estenedor principal con Tailwind para que se vea centrado y limpio
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
      
      {/* CABECERA (Header) */}
      <header className="text-center space-y-2">
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
          Dev Challenge v2.0
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          H2O<span className="text-blue-600">.</span>Impact
        </h1>
        <p className="text-slate-500 text-lg">Visualiza tu huella, protege el futuro.</p>
      </header>

      {/* CUERPO PRINCIPAL (Main) */}
      <main className="grid grid-cols-1 gap-12">
        
        {/* Pasamos la función saveRecord como un "prop" a la calculadora */}
        <section>
          <Calculator onSave={saveRecord} />
        </section>

        {/* Pasamos el historial a los otros componentes para que se dibujen */}
        <section className="space-y-12">
          <Dashboard history={history} />
          <Achievements history={history} />
        </section>

      </main>

      {/* PIE DE PÁGINA */}
      <footer className="pt-10 border-t border-slate-200 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} - Proyecto desarrollado para el Dev Challenge Universitario
      </footer>
    </div>
  );
}

export default App;