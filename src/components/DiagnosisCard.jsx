import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const DiagnosisCard = ({ diagnosis }) => {
  if (!diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 130, damping: 16 }}
      className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl p-6 shadow-[6px_6px_20px_rgba(0,0,0,0.05),-6px_-6px_20px_rgba(255,255,255,0.8)] transition-all"
    >
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className="p-4 bg-blue-100/70 text-blue-700 rounded-full flex items-center justify-center shadow-inner"
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <Activity size={24} />
        </motion.div>
        <h3 className="text-xl font-extrabold text-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-10 after:h-1 after:bg-blue-200/50 after:rounded-full">
          Diagnóstico de Consumo
        </h3>
      </div>

      <p className="text-slate-700 font-semibold text-lg mb-2">
        {diagnosis.title}
      </p>

      <p className="text-sm text-slate-400 leading-relaxed">
        {diagnosis.description}
      </p>
    </motion.div>
  );
};

export default DiagnosisCard;
