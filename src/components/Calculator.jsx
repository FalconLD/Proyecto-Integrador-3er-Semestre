import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Coffee, Shirt, Utensils } from 'lucide-react';

const WATER_COEFFICIENTS = {
  ducha: 12,
  ropa: 50,
  cocina: 15,
  cafe: 140
};

export default function Calculator({ onSave }) {
  const [data, setData] = useState({ ducha: '', ropa: '', cocina: '', cafe: '' });

  const calculateTotal = () => {
    const total = Math.round(
      (Number(data.ducha) * WATER_COEFFICIENTS.ducha) +
      ((Number(data.ropa) * WATER_COEFFICIENTS.ropa) / 7) +
      (Number(data.cocina) * WATER_COEFFICIENTS.cocina) +
      (Number(data.cafe) * WATER_COEFFICIENTS.cafe)
    );
    
    if (total > 0) {
      onSave({ fecha: new Date().toLocaleDateString(), total });
      alert(`💧 Impacto calculado: ${total} litros diarios`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-blue-50"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <Droplets /> Calculadora de Impacto
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Droplets size={16} /> Minutos de ducha/día
          </label>
          <input 
            type="number" 
            className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            onChange={(e) => setData({...data, ducha: e.target.value})}
            placeholder="Ej: 10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Shirt size={16} /> Lavados ropa/semana
          </label>
          <input 
            type="number" 
            className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            onChange={(e) => setData({...data, ropa: e.target.value})}
            placeholder="Ej: 3"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Utensils size={16} /> Usos cocina/día
          </label>
          <input 
            type="number" 
            className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            onChange={(e) => setData({...data, cocina: e.target.value})}
            placeholder="Ej: 2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Coffee size={16} /> Tazas de café/día
          </label>
          <input 
            type="number" 
            className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            onChange={(e) => setData({...data, cafe: e.target.value})}
            placeholder="Ej: 1"
          />
        </div>
      </div>

      <button 
        onClick={calculateTotal}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
      >
        Analizar mi Huella
      </button>
    </motion.div>
  );
}