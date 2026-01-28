import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Coffee, 
  Utensils, 
  Shirt, 
  Droplet, 
  AlertTriangle,
  Waves,
  MapPin,
  MessageSquare,
  Zap
} from 'lucide-react';

export default function InfoSection() {
  const virtualData = [
    {
      title: "Huella de la Carne",
      value: "15,000 Litros",
      desc: "Es la cantidad aproximada para producir solo 1 kg de carne de res, considerando el riego del forraje y el consumo del ganado.",
      icon: <Utensils className="text-red-500" />,
      color: "bg-red-50"
    },
    {
      title: "Café vs Té",
      value: "140L vs 30L",
      desc: "Una taza de café requiere casi 5 veces más agua que una de té debido a los procesos de cultivo y post-cosecha.",
      icon: <Coffee className="text-amber-600" />,
      color: "bg-amber-50"
    },
    {
      title: "Industria Textil",
      value: "7,500 Litros",
      desc: "Producir un solo par de jeans de mezclilla consume lo equivalente a lo que una persona bebe en 7 años.",
      icon: <Shirt className="text-blue-500" />,
      color: "bg-blue-50"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 pb-20"
    >
      {/* Sección 1: Concepto Técnico */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-blue-50">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
            <Info size={28} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-none">¿Qué estamos midiendo?</h2>
        </div>
        
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          La <strong>huella hídrica</strong> no es solo el agua que sale de tu grifo. Es un indicador integral de la apropiación de los recursos de agua dulce, incluyendo el consumo directo e indirecto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
              <Droplet size={18} /> Consumo Directo
            </h4>
            <p className="text-sm text-slate-500 italic">
              Es el uso doméstico diario. Una ducha promedio consume <strong>12 litros por minuto</strong> y una descarga de inodoro antiguo hasta <strong>13 litros</strong>.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">
              <Waves size={18} /> Huella Virtual
            </h4>
            <p className="text-sm text-slate-500 italic">
              Es el agua "invisible" contenida en los productos. Representa la mayor parte de tu impacto hídrico total.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 2: Datos de Impacto Virtual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {virtualData.map((item, idx) => (
          <div key={idx} className={`${item.color} p-8 rounded-[2rem] border border-transparent shadow-sm hover:shadow-md transition-all`}>
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
              {item.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-xl mb-1">{item.title}</h3>
            <div className="text-2xl font-black text-slate-900 mb-4">{item.value}</div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Sección 3: Compromiso Campus PUCE */}
      <div className="bg-blue-600 p-8 md:p-12 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-blue-200 font-bold uppercase tracking-widest text-xs mb-4">
            <MapPin size={16} /> Hacia un Campus Sostenible
          </div>
          <h3 className="text-3xl font-black mb-8">Recomendaciones Comunidad PUCE</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-blue-700/30 p-6 rounded-3xl border border-blue-400/30">
                <MessageSquare className="shrink-0 text-blue-200" />
                <div>
                  <h4 className="font-bold text-lg">Reporta Fugas en el Campus</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">Si detectas grifos goteando en los baños de la universidad, repórtalo. Una fuga pequeña desperdicia más de <strong>30 litros al día</strong>.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-blue-700/30 p-6 rounded-3xl border border-blue-400/30">
                <Zap className="shrink-0 text-blue-200" />
                <div>
                  <h4 className="font-bold text-lg">Termos y Bebederos</h4>
                  <p className="text-sm text-blue-100 leading-relaxed">Usa los bebederos del campus con tu propio termo para reducir la huella hídrica asociada a botellas plásticas.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 p-8 rounded-[2rem] border border-white/20 backdrop-blur-sm">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={20} /> Sabías que...
                </h4>
                <p className="text-sm leading-relaxed text-blue-50">
                  La transición a <strong>inodoros de alta eficiencia (6L)</strong> en infraestructuras grandes como la PUCE reduce el consumo hídrico en más de un <strong>50%</strong> comparado con modelos antiguos.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Droplet 
          className="absolute -right-20 -bottom-20 text-slate-800 opacity-40 pointer-events-none" 
          size={300} 
          fill="currentColor" 
        />
      </div>
    </motion.div>
  );
}