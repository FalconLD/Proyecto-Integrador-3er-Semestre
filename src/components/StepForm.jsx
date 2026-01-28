import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Clock,
  Droplets,
  Coffee,
  ChevronRight,
  ChevronLeft,
  Save,
  Utensils,
  WashingMachine
} from 'lucide-react';

export default function StepForm({ onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    people: 1,
    showerTime: 5,
    toiletType: 'moderno',
    keyQuestionAnswer: 'No', // Recuperamos esta variable para los logros
    flushesPerDay: 5,
    laundryLoads: 2,
    meatConsumption: 'moderado',
    coffeeTazas: 1,
    teaTazas: 0,
    waterDrinking: 2
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    // Cálculo de Consumo Directo (Meta OMS 150L)
    const litrosDucha = (formData.showerTime * 12); //
    const litrosInodoro = formData.toiletType === 'moderno' ? (formData.flushesPerDay * 6) : (formData.flushesPerDay * 13); //
    const litrosLavadora = (formData.laundryLoads * 60) / 7;
    const litrosBeber = Number(formData.waterDrinking);
    const desperdicioLlave = formData.keyQuestionAnswer === 'Sí' ? 10 : 0;

    const consumoDirectoTotal = Math.round(litrosDucha + litrosInodoro + litrosLavadora + litrosBeber + desperdicioLlave);

    // Cálculo de Huella Virtual (Dato informativo para la Wiki)
    const dietaImpacto = { 'bajo': 1500, 'moderado': 3000, 'alto': 5000 };
    const huellaDieta = dietaImpacto[formData.meatConsumption];
    const huellaBebidas = (formData.coffeeTazas * 140) + (formData.teaTazas * 30); //

    onSave({
      fecha: new Date().toLocaleDateString(),
      fechaISO: new Date().toISOString(),
      total: consumoDirectoTotal,
      virtualTotal: Math.round(huellaDieta + huellaBebidas),
      details: formData
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-blue-50"
    >
      <div className="mb-10 flex justify-between items-center">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2 w-8 rounded-full transition-all ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-red-500 font-bold text-sm">Cancelar</button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
            <h2 className="text-3xl font-black flex items-center gap-3"><User className="text-blue-600" /> Miembros del Hogar</h2>
            <p className="text-slate-500 font-medium">¿Cuántas personas viven contigo actualmente?</p>
            <div className="py-8 text-center">
              <input type="range" min="1" max="10" value={formData.people} onChange={e => setFormData({...formData, people: +e.target.value})} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="text-6xl font-black text-blue-600 mt-6">{formData.people}</div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
            <h2 className="text-3xl font-black flex items-center gap-3"><Clock className="text-blue-600" /> Higiene</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Minutos en la ducha</label>
                <input type="number" value={formData.showerTime} onChange={e => setFormData({...formData, showerTime: +e.target.value})} className="w-full p-6 bg-slate-50 rounded-2xl text-center text-4xl font-black text-blue-600 border-2 border-transparent focus:border-blue-400 outline-none transition-all" />
              </div>
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">¿Dejas la llave abierta al cepillarte?</label>
                <div className="flex gap-4">
                  {['Sí', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => setFormData({...formData, keyQuestionAnswer: opt})} 
                    className={`flex-1 p-5 rounded-2xl font-bold transition-all ${formData.keyQuestionAnswer === opt ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
            <h2 className="text-3xl font-black flex items-center gap-3"><WashingMachine className="text-blue-600" /> Lavandería e Inodoro</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Descargas de inodoro al día</label>
                <input type="number" value={formData.flushesPerDay} onChange={e => setFormData({...formData, flushesPerDay: +e.target.value})} className="w-full p-6 bg-slate-50 rounded-2xl text-center text-3xl font-black text-blue-600 outline-none" />
              </div>
              <div className="flex gap-4">
                {['moderno', 'antiguo'].map(type => (
                  <button key={type} type="button" onClick={() => setFormData({...formData, toiletType: type})} 
                  className={`flex-1 p-4 rounded-2xl font-bold capitalize transition-all ${formData.toiletType === type ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    {type} {type === 'moderno' ? '(6L)' : '(13L)'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
            <h2 className="text-3xl font-black flex items-center gap-3"><Utensils className="text-blue-600" /> Alimentación</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                {id: 'bajo', label: 'Vegetariano / Vegano', desc: 'Huella hídrica mínima'},
                {id: 'moderado', label: 'Consumo Moderado', desc: 'Carne de res 2-3 veces/semana'},
                {id: 'alto', label: 'Consumo Frecuente', desc: 'Carne de res casi a diario'}
              ].map(opt => (
                <button key={opt.id} type="button" onClick={() => setFormData({...formData, meatConsumption: opt.id})} 
                className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col ${formData.meatConsumption === opt.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                  <span className="font-bold text-slate-800 text-lg">{opt.label}</span>
                  <span className="text-xs text-slate-500 font-medium">{opt.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8 text-center">
            <h2 className="text-3xl font-black flex items-center gap-3 text-left"><Coffee className="text-blue-600" /> Bebidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tazas Café</label>
                <input type="number" value={formData.coffeeTazas} onChange={e => setFormData({...formData, coffeeTazas: +e.target.value})} className="bg-transparent text-center text-3xl font-black text-blue-600 outline-none w-full" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Tazas Té</label>
                <input type="number" value={formData.teaTazas} onChange={e => setFormData({...formData, teaTazas: +e.target.value})} className="bg-transparent text-center text-3xl font-black text-blue-600 outline-none w-full" />
              </div>
            </div>
            <div className="pt-4">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-3 tracking-widest">Litros de agua que bebes hoy</label>
              <div className="bg-blue-600/5 p-8 rounded-[3rem] border-4 border-dashed border-blue-100">
                <input type="number" step="0.5" value={formData.waterDrinking} onChange={e => setFormData({...formData, waterDrinking: +e.target.value})} className="bg-transparent text-center text-6xl font-black text-blue-600 outline-none w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-between items-center h-16">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-all px-4"><ChevronLeft size={24} /> Atrás</button>
        ) : <div className="w-20" />}

        {step < 5 ? (
          <button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-3xl font-bold flex items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 h-full">
            <span>Siguiente</span> <ChevronRight size={24} />
          </button>
        ) : (
          <button type="button" onClick={handleFinish} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-3xl font-bold flex items-center gap-3 shadow-xl shadow-emerald-100 transition-all active:scale-95 h-full">
            <Save size={24} /> <span>Finalizar Análisis</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}