import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import Ranking from "../components/Ranking";
import { getUserPosition, getCampusAverage } from "../utils/ranking";
import { checkRankingAchievements } from "../utils/rankingAchievements";
import { triggerConfetti } from "../utils/celebration";
import { api } from "../services/api";
import Achievements from "../components/Achievements";

export default function RankingPage({ user, history }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  const average =
    history.length > 0
      ? Math.round(
          history.reduce((acc, r) => acc + r.total, 0) / history.length
        )
      : 0;

  useEffect(() => {
    setLoading(true);
    api.ranking
      .get()
      .then((data) => {
        const mapped = (data || []).map((e) => ({
          id: String(e.usuarioId || e._id || e.id),
          avgConsumption: e.avgConsumption ?? 0,
          position: e.position,
        }));
        setRanking(mapped);
      })
      .catch(() => setRanking([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user?.id || average <= 0) return;
    api.ranking
      .upsert({
        usuarioId: user.id,
        nombre: user.nombre,
        avgConsumption: average,
      })
      .then(() => {
        api.ranking.get().then((data) => {
          const mapped = (data || []).map((e) => ({
            id: String(e.usuarioId || e._id || e.id),
            avgConsumption: e.avgConsumption ?? 0,
            position: e.position,
          }));
          setRanking(mapped);
        });
      })
      .catch(() => {});
  }, [user?.id, average]);

  const myPosition = getUserPosition(ranking, String(user?.id));
  const campusAvg = getCampusAverage(ranking);

  useEffect(() => {
    if (!myPosition) return;

    const unlocked = checkRankingAchievements(
      myPosition.position,
      ranking.length
    );

    const saved =
      JSON.parse(localStorage.getItem("h2o_ranking_achievements")) || [];

    unlocked.forEach((a) => {
      if (!saved.includes(a)) {
        saved.push(a);
        triggerConfetti();

        toast.success("¡Nuevo logro desbloqueado!", {
          description:
            a === "top_50"
              ? "Estás en el Top 50% del campus"
              : a === "top_10"
              ? "Entraste al Top 10 semanal"
              : "Eres el más eficiente del campus 🏆",
        });
      }
    });

    localStorage.setItem(
      "h2o_ranking_achievements",
      JSON.stringify(saved)
    );
  }, [myPosition, ranking.length]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 md:p-12 rounded-3xl shadow-lg border border-blue-100">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
          Ranking Anónimo
        </h2>
        <p className="text-slate-500 italic text-md md:text-lg">
          Comparación semanal de consumo hídrico (PUCE)
        </p>
        <div className="mt-4 text-slate-700">
          <span className="font-bold">Tu promedio:</span>{" "}
          <span className="text-blue-600">{average} L</span>
        </div>
      </div>

      {/* RANKING */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {loading ? (
          <p className="text-slate-500 text-center py-8">Cargando ranking…</p>
        ) : (
          <Ranking
            ranking={ranking}
            userPosition={myPosition}
            campusAvg={campusAvg}
          />
        )}
      </motion.div>
      <div className="pt-10 border-t border-slate-100">
        <Achievements history={history} />
      </div>
    </motion.section>

  );
}
