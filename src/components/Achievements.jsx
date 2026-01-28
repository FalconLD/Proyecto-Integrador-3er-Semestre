import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Droplet, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Calendar,
  Coffee
} from 'lucide-react';
import { triggerConfetti } from '../utils/celebration';
import { toast } from 'sonner';

export default function Achievements({ history }) {
  const totalRecords = history.length;
  const lastRecord = history[0]; 
  const DAILY_GOAL = 150;

  // ESTADO PERSISTENTE: Cargamos los logros ya celebrados desde el almacenamiento local
  const [celebratedIds, setCelebratedIds] = useState(() => {
    const saved = localStorage.getItem('h2o_achievements_claimed');
    return saved ? JSON.parse(saved) : [];
  });

  const averageConsumption = totalRecords > 0
    ? history.reduce((sum, r) => sum + r.total, 0) / totalRecords
    : 0;

  // Los badges se recalculan en cada renderizado basándose en el prop 'history'
  const badges = [
    {
      id: 'primero',
      name: 'Eco-Estudiante',
      desc: 'Realizaste tu primer análisis en H2O.Impact',
      unlocked: totalRecords >= 1,
      icon: <Droplet className="text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      id: 'guerrero',
      name: 'Guerrero H2O',
      desc: 'Lograste un consumo menor a 150L el día de hoy',
      unlocked: lastRecord && lastRecord.total > 0 && lastRecord.total <= DAILY_GOAL,
      icon: <ShieldCheck className="text-emerald-500" />,
      color: 'bg-emerald-50'
    },
    {
      id: 'ducha_pro',
      name: 'Ducha Relámpago',
      desc: 'Tu última ducha duró 5 minutos o menos',
      unlocked: lastRecord?.details?.showerTime <= 5,
      icon: <Clock className="text-cyan-500" />,
      color: 'bg-cyan-50'
    },
    {
      id: 'cero_goteo',
      name: 'Cero Desperdicio',
      desc: 'Cierras el grifo al cepillarte y cumpliste la meta',
      unlocked: lastRecord?.details?.keyQuestionAnswer === 'No' && lastRecord?.total <= DAILY_GOAL,
      icon: <CheckCircle className="text-indigo-500" />,
      color: 'bg-indigo-50'
    },
    {
      id: 'consistencia',
      name: 'Triple Impacto',
      desc: 'Has completado 3 registros en el sistema',
      unlocked: totalRecords >= 3,
      icon: <Zap className="text-amber-500" />,
      color: 'bg-amber-50'
    },
    {
      id: 'semana',
      name: 'Semana Verde',
      desc: 'Mantuviste el hábito por 7 registros',
      unlocked: totalRecords >= 7,
      icon: <Calendar className="text-teal-500" />,
      color: 'bg-teal-50'
    },
    {
      id: 'maestro',
      name: 'Maestro del Ahorro',
      desc: 'Tu promedio histórico es menor a 200L',
      unlocked: totalRecords >= 5 && averageConsumption < 200,
      icon: <Award className="text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      id: 'eco_dieta',
      name: 'Héroe Invisible',
      desc: 'Redujiste tu huella indirecta (0 tazas de café)',
      unlocked: lastRecord && lastRecord.details?.coffeeTazas === 0,
      icon: <Coffee className="text-orange-500" />,
      color: 'bg-orange-50'
    }
  ];

  // Monitor de Logros con Memoria Persistente
  useEffect(() => {
    if (totalRecords === 0) return;

    let newCelebrations = [...celebratedIds];
    let showConfetti = false;

    badges.forEach(badge => {
      // Si está desbloqueado pero NO está en la lista de celebrados
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
  }, [history]); // Se dispara inmediatamente al recibir nuevo historial

  return (
    <div className="mt-8 pb-10">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Award className="text-amber-500" /> Logros y Reconocimientos
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map(badge => (
          <motion.div
            key={badge.id}
            layout // Ayuda a que la transición de color sea fluida
            initial={false}
            animate={badge.unlocked ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.95 }}
            whileHover={badge.unlocked ? { scale: 1.02, y: -5 } : {}}
            className={`p-5 rounded-[2rem] border-2 transition-all duration-500 ${
              badge.unlocked
                ? `${badge.color} border-transparent shadow-lg shadow-blue-100/20`
                : 'bg-slate-50 border-slate-100 grayscale'
            }`}
          >
            <div className={`mb-3 p-3 inline-block rounded-2xl ${badge.unlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
              {badge.icon}
            </div>

            <p className="font-bold text-sm text-slate-800 leading-tight">
              {badge.name}
            </p>
            <p className="text-[10px] text-slate-500 leading-tight mt-2 font-medium">
              {badge.desc}
            </p>

            <div className="mt-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider">
              {badge.unlocked ? (
                <span className="text-blue-600 flex items-center gap-1">
                  <CheckCircle size={10} /> Completado
                </span>
              ) : (
                <span className="text-slate-300">Bloqueado</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}