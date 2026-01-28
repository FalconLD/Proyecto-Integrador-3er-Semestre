import { Trophy, Users, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Ranking({ ranking, userPosition, campusAvg }) {
  const isBetterThanAvg =
    userPosition && userPosition.avgConsumption <= campusAvg;

  return (
    <div className="space-y-8">
      {/* TÍTULO */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-3xl shadow-md border border-blue-100">
        <div className="p-4 bg-amber-100 rounded-full text-amber-600 shadow-inner">
          <Trophy size={28} />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Ranking Anónimo PUCE
          </h3>
          <p className="text-slate-500 text-sm md:text-base italic">
            Comparación semanal de consumo
          </p>
        </div>
      </div>

      {/* TU POSICIÓN */}
      {userPosition && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
          className={`p-6 rounded-3xl border transition-all ${
            isBetterThanAvg
              ? "bg-emerald-50 border-emerald-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <p className="text-sm text-slate-600">Tu posición actual</p>

          <div className="flex items-center justify-between mt-2">
            <p className="text-4xl md:text-5xl font-black text-slate-800">
              #{userPosition.position}
              <span className="text-base md:text-lg font-medium text-slate-500">
                {" "}de {ranking.length}
              </span>
            </p>

            <div className="flex items-center gap-2 text-sm md:text-base font-bold">
              {isBetterThanAvg ? (
                <>
                  <TrendingUp className="text-emerald-600" />
                  <span className="text-emerald-700">Mejor que el promedio</span>
                </>
              ) : (
                <>
                  <TrendingDown className="text-orange-600" />
                  <span className="text-orange-700">Sobre el promedio</span>
                </>
              )}
            </div>
          </div>

          <p className="text-sm md:text-base text-slate-500 mt-2">
            Consumo promedio:{" "}
            <strong>{userPosition.avgConsumption} L/día</strong>
          </p>
        </motion.div>
      )}

      {/* PROMEDIO CAMPUS */}
      <div className="flex items-center gap-3 text-slate-600 text-sm md:text-base">
        <Users size={20} />
        Promedio del campus: <strong>{campusAvg} L/día</strong>
      </div>

      {/* TOP 5 */}
      <div className="space-y-3">
        <p className="text-xs md:text-sm uppercase font-bold tracking-wider text-slate-400">
          Top 5 más eficientes
        </p>

        {ranking.slice(0, 5).map((u, idx) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.06)" }}
            className="flex justify-between items-center bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 transition-all cursor-pointer"
          >
            <span className="font-bold text-slate-700">
              #{idx + 1} Usuario #{u.id.slice(0, 4)}
            </span>
            <span className="font-extrabold text-emerald-600">
              {u.avgConsumption} L
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
