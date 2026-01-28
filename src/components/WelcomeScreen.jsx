import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, ArrowRight, Mail } from 'lucide-react';

export default function WelcomeScreen({ onComplete }) {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    edad: '', 
    email: '',
    genero: 'Estudiante PUCE' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica de correo PUCE
    if (!formData.email.toLowerCase().endsWith('@puce.edu.ec')) {
      alert("Por favor, usa tu correo institucional @puce.edu.ec");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-blue-50"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Droplet size={32} fill="currentColor" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center text-slate-900 mb-2">H2O.Impact</h1>
        <p className="text-slate-500 text-center mb-8 italic">Identificación Estudiantil PUCE</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
            <input 
              required
              className="w-full p-4 mt-1 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-400 outline-none transition"
              placeholder="Juan Pérez"
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Edad</label>
              <input 
                required
                type="number"
                className="w-full p-4 mt-1 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-400 outline-none transition"
                placeholder="21"
                onChange={e => setFormData({...formData, edad: e.target.value})}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Correo Institucional</label>
              <input 
                required
                type="email"
                className="w-full p-4 mt-1 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-400 outline-none transition"
                placeholder="usuario@puce.edu.ec"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95 mt-4"
          >
            Entrar al Sistema <ArrowRight size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}