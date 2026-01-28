import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const AdviceCard = ({ advice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <Lightbulb size={20} />
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-800">
            {advice.title}
          </h4>

          <p className="text-slate-600 text-sm leading-relaxed">
            {advice.text}
          </p>

          {advice.impact && (
            <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2">
              Impacto estimado: {advice.impact}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdviceCard;
