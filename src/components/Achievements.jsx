import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Droplet, Zap, ShieldCheck, Clock, CheckCircle, Calendar, Coffee } from 'lucide-react';
import { triggerConfetti } from '../utils/celebration';
import { toast } from 'sonner';

export default function AchievementsUltraSoftPremium({ history }) {
  const totalRecords = history.length;
  const lastRecord = history[0]; 
  const DAILY_GOAL = 150;

  const [celebratedIds, setCelebratedIds] = useState(() => {
    const saved = localStorage.getItem('h2o_achievements_claimed');
    return saved ? JSON.parse(saved) : [];
  });

  const averageConsumption = totalRecords > 0
    ? history.reduce((sum, r) => sum + r.total, 0) / totalRecords
    : 0;

  const badges = [
    { id: 'primero', name: 'Eco-Estudiante', desc: 'Realizaste tu primer análisis en H2O.Impact', unlocked: totalRecords >= 1, icon: <Droplet className="text-blue-500" />, gradient: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { id: 'guerrero', name: 'Guerrero H2O', desc: 'Lograste un consumo menor a 150L el día de hoy', unlocked: lastRecord?.total > 0 && lastRecord?.total <= DAILY_GOAL, icon: <ShieldCheck className="text-green-500" />, gradient: 'bg-gradient-to-br from-green-100 to-green-200' },
    { id: 'ducha_pro', name: 'Ducha Relámpago', desc: 'Tu última ducha duró 5 minutos o menos', unlocked: lastRecord?.details?.showerTime <= 5, icon: <Clock className="text-cyan-500" />, gradient: 'bg-gradient-to-br from-cyan-100 to-cyan-200' },
    { id: 'cero_goteo', name: 'Cero Desperdicio', desc: 'Cierras el grifo al cepillarte y cumpliste la meta', unlocked: lastRecord?.details?.keyQuestionAnswer === 'No' && lastRecord?.total <= DAILY_GOAL, icon: <CheckCircle className="text-indigo-500" />, gradient: 'bg-gradient-to-br from-indigo-100 to-indigo-200' },
    { id: 'consistencia', name: 'Triple Impacto', desc: 'Has completado 3 registros en el sistema', unlocked: totalRecords >= 3, icon: <Zap className="text-amber-500" />, gradient: 'bg-gradient-to-br from-amber-100 to-amber-200' },
    { id: 'semana', name: 'Semana Verde', desc: 'Mantuviste el hábito por 7 registros', unlocked: totalRecords >= 7, icon: <Calendar className="text-teal-500" />, gradient: 'bg-gradient-to-br from-teal-100 to-teal-200' },
    { id: 'maestro', name: 'Maestro del Ahorro', desc: 'Tu promedio histórico es menor a 200L', unlocked: totalRecords >= 5 && averageConsumption < 200, icon: <Award className="text-purple-500" />, gradient: 'bg-gradient-to-br from-purple-100 to-purple-200' },
    { id: 'eco_dieta', name: 'Héroe Invisible', desc: 'Redujiste tu huella indirecta (0 tazas de café)', unlocked: lastRecord?.details?.coffeeTazas === 0, icon: <Coffee className="text-orange-500" />, gradient: 'bg-gradient-to-br from-orange-100 to-orange-200' }
  ];

  useEffect(() => {
    if (totalRecords === 0) return;

    let newCelebrations = [...celebratedIds];
    let showConfetti = false;

    badges.forEach(badge => {
      if (badge.unlocked && !celebratedIds.includes(badge.id)) {
        showConfetti = true;
        newCelebrations.push(badge.id);

        toast.success(`¡Logro Desbloqueado: ${badge.name}!`, {
          description: badge.desc,
          duration: 5000,
        });
      }
    });

    if (showConfetti) {
      triggerConfetti();
      setCelebratedIds(newCelebrations);
      localStorage.setItem('h2o_achievements_claimed', JSON.stringify(newCelebrations));
    }
  }, [history]);

  return (
    <div className="mt-8 pb-10">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
        <Award className="text-amber-500" size={24} /> Logros y Reconocimientos
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {badges.map(badge => (
          <motion.div
            key={badge.id}
            layout
            initial={false}
            animate={badge.unlocked ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.95 }}
            whileHover={badge.unlocked ? { scale: 1.06, y: -6 } : {}}
            className={`relative p-5 rounded-2xl transition-all duration-500 overflow-hidden
              ${badge.unlocked
                ? 'shadow-lg shadow-slate-300/20'
                : 'bg-slate-50 border border-slate-200 shadow-sm opacity-70 grayscale'
              }`}
          >
            {/* Gradiente completo de fondo */}
            {badge.unlocked && <div className={`absolute inset-0 ${badge.gradient} z-0`} />}

            {/* Icono con pop */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: badge.unlocked ? 1 : 0.85 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mb-4 p-4 rounded-xl relative z-10 bg-white shadow-inner"
            >
              {badge.icon}
            </motion.div>

            {/* Texto */}
            <p className="font-semibold text-sm text-slate-900 z-10 relative">{badge.name}</p>
            <p className="text-[10px] text-slate-500 leading-snug mt-1 z-10 relative">{badge.desc}</p>

            {/* Estado */}
            <div className="mt-4 flex items-center justify-between text-[9px] font-bold uppercase tracking-wider z-10 relative">
              {badge.unlocked ? (
                <span className="text-blue-600 flex items-center gap-1">
                  <CheckCircle size={12} /> Completado
                </span>
              ) : (
                <span className="text-slate-400">Bloqueado</span>
              )}
            </div>

            {/* Brillo animado suave */}
            {badge.unlocked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut', repeat: Infinity, repeatType: 'mirror' }}
                className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-white shadow-md z-0"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
