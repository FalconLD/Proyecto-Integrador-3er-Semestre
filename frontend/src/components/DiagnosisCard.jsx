import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const DiagnosisCard = ({ diagnosis, isAIAdvice = false, aiAdvice }) => {
  if (!diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 25px 50px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 130, damping: 16 }}
      className={`p-6 shadow-lg rounded-3xl transition-all ${
        isAIAdvice
          ? "bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500"
          : "bg-gradient-to-br from-white to-slate-50 border border-slate-100"
      }`}
    >
      <div className="flex items-center gap-4 mb-5">
        <motion.div
          className={`p-4 rounded-full flex items-center justify-center shadow-inner ${
            isAIAdvice ? "bg-green-100 text-green-600" : "bg-blue-100/70 text-blue-700"
          }`}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <Activity size={24} />
        </motion.div>
        <h3
          className={`text-xl font-extrabold text-slate-800 relative after:absolute after:bottom-0 after:left-0 after:w-10 after:h-1 ${
            isAIAdvice ? "after:bg-green-200/50" : "after:bg-blue-200/50"
          } after:rounded-full`}
        >
          Diagnóstico de Consumo
        </h3>
      </div>

      <p className="text-slate-700 font-semibold text-lg mb-2">{diagnosis.title}</p>
      <p className="text-sm text-slate-400 leading-relaxed">{diagnosis.description}</p>

      {/* Bloque IA si existe */}
      {isAIAdvice && aiAdvice && (
        <div className="mt-4 p-4 bg-white border border-green-200 rounded-lg shadow-md">
          <p className="text-green-700 font-semibold text-sm">Diagnóstico optimizado por IA:</p>
          <p className="text-sm text-green-800 mt-1">{aiAdvice.text}</p>
        </div>
      )}
    </motion.div>
  );
};

export default DiagnosisCard;
