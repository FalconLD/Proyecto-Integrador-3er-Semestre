import { motion } from 'framer-motion';
import { Info, Coffee, Utensils, Shirt, Droplet, AlertTriangle, Waves, MapPin, MessageSquare, Zap } from 'lucide-react';

export default function InfoSection() {
  const virtualData = [
    {
      title: "Huella de la Carne",
      value: "15,000 L",
      desc: "Producción de 1 kg de carne de res considerando agua directa e indirecta.",
      icon: <Utensils className="text-red-500" />,
      gradient: "bg-gradient-to-br from-red-100 to-red-200"
    },
    {
      title: "Café vs Té",
      value: "140L vs 30L",
      desc: "Una taza de café requiere casi 5 veces más agua que una de té.",
      icon: <Coffee className="text-amber-500" />,
      gradient: "bg-gradient-to-br from-amber-100 to-amber-200"
    },
    {
      title: "Industria Textil",
      value: "7,500 L",
      desc: "Un par de jeans de mezclilla equivale al consumo de agua de 7 años de una persona.",
      icon: <Shirt className="text-blue-500" />,
      gradient: "bg-gradient-to-br from-blue-100 to-blue-200"
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
      {/* Sección 1: Concepto Técnico */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
            <Info size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-none">¿Qué estamos midiendo?</h2>
        </div>
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          La <strong>huella hídrica</strong> incluye consumo directo e indirecto en productos y servicios.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
              <Droplet size={18} /> Consumo Directo
            </h4>
            <p className="text-sm text-slate-500 italic">
              Una ducha promedio consume <strong>12 L/min</strong> y un inodoro antiguo hasta <strong>13 L</strong>.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">
              <Waves size={18} /> Huella Virtual
            </h4>
            <p className="text-sm text-slate-500 italic">
              Agua "invisible" contenida en productos. Representa la mayor parte de tu impacto hídrico total.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 2: Datos de Impacto Virtual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {virtualData.map((item, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.05 }} className={`relative p-8 rounded-2xl overflow-hidden shadow-md ${item.gradient}`}>
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-6">
              {item.icon}
            </div>
            <h3 className="font-bold text-slate-900 text-xl mb-1">{item.title}</h3>
            <div className="text-2xl font-extrabold text-slate-900 mb-4">{item.value}</div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Sección 3: Compromiso Campus PUCE */}
      <div className="relative bg-blue-600 p-8 md:p-12 rounded-[2.5rem] shadow-xl text-white overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-2 text-blue-200 font-bold uppercase tracking-widest text-xs">
            <MapPin size={16} /> Hacia un Campus Sostenible
          </div>
          <h3 className="text-3xl font-black">Recomendaciones Comunidad PUCE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-blue-700/30 p-6 rounded-3xl border border-blue-400/20 shadow-inner">
                <MessageSquare className="shrink-0 text-blue-200" />
                <div>
                  <h4 className="font-bold text-lg">Reporta Fugas en el Campus</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Una fuga pequeña desperdicia más de <strong>30 L/día</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-blue-700/30 p-6 rounded-3xl border border-blue-400/20 shadow-inner">
                <Zap className="shrink-0 text-blue-200" />
                <div>
                  <h4 className="font-bold text-lg">Termos y Bebederos</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Usa los bebederos del campus con tu propio termo para reducir botellas plásticas.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm shadow-inner">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={20} /> Sabías que...
                </h4>
                <p className="text-sm leading-relaxed text-blue-50">
                  La transición a <strong>inodoros de alta eficiencia (6L)</strong> reduce el consumo hídrico en más de <strong>50%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
