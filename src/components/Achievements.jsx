import React from 'react';
import { motion } from 'framer-motion';
import { Award, Droplet, Zap, ShieldCheck } from 'lucide-react';

export default function Achievements({ history }) {
  const totalRecords = history.length;
  const lastTotal = history[0]?.total || 0;
  
  // Lógica de medallas
  const badges = [
    {
      id: 1,
      name: "Primer Paso",
      desc: "Realizaste tu primer análisis",
      unlocked: totalRecords >= 1,
      icon: <Droplet className="text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      id: 2,
      name: "Guerrero H2O",
      desc: "Consumo menor a 150L (Meta OMS)",
      unlocked: lastTotal > 0 && lastTotal <= 150,
      icon: <ShieldCheck className="text-emerald-500" />,
      color: "bg-emerald-50"
    },
    {
      id: 3,
      name: "Consistencia",
      desc: "3 registros completados",
      unlocked: totalRecords >= 3,
      icon: <Zap className="text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      id: 4,
      name: "Maestro del Ahorro",
      desc: "Mantuviste el promedio bajo",
      unlocked: totalRecords >= 5 && (history.reduce((a, b) => a + b.total, 0) / totalRecords) < 200,
      icon: <Award className="text-purple-500" />,
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Logros del Sistema</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-2xl border-2 transition-all ${
              badge.unlocked 
                ? `${badge.color} border-transparent shadow-sm` 
                : "bg-slate-50 border-slate-100 grayscale opacity-40"
            }`}
          >
            <div className="mb-2">{badge.icon}</div>
            <p className="font-bold text-sm text-slate-800">{badge.name}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}