import { useEffect, useState } from "react";
import DiagnosisCard from "../components/DiagnosisCard";
import AdviceCard from "../components/AdviceCard";
import { getAdviceFromHistory } from "../utils/adviceEngine";
// import { enhanceAdviceWithAI } from "../utils/adviceAI"; // Comentada para deshabilitar la IA
import Achievements from '../components/Achievements'; 

const AdvicePage = ({ history }) => {
  const [diagnosis, setDiagnosis] = useState(null);
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiAdviceMap, setAiAdviceMap] = useState({}); // Guardamos la IA por consejo

  useEffect(() => {
    if (!history || history.length === 0) return;

    // Consejos base
    const result = getAdviceFromHistory(history);
    setDiagnosis(result.diagnosis);
    setAdviceList(result.advices.map(a => ({ ...a, enhanced: false })));

    // Mejora opcional con IA
    const enhanceAdvice = async () => {
      setLoading(true);
      try {
        await Promise.all(
          result.advices.map(async (advice, index) => {
            if (advice.enhanced) return;

            try {
              // Comentado para deshabilitar la llamada a la IA
              /* const enhanced = await enhanceAdviceWithAI({
                average: result.average,
                diagnosis: result.diagnosis,
                advice,
                context: {
                  trend: result.trend,
                  worstDay: result.worstDay,
                  habits: result.habits,
                },
              }); */

              // Aquí debería actualizarse el consejo con la IA
              // setAdviceList(prev =>
              //   prev.map((a, i) =>
              //     i === index ? { ...a, ...enhanced, enhanced: true } : a
              //   )
              // );

              // Guardamos IA en el map (comentado)
              // setAiAdviceMap(prev => ({ ...prev, [advice.id]: enhanced }));

            } catch (err) {
              console.warn(`IA no disponible para consejo ${advice.id}`, err);
            }
          })
        );
      } finally {
        setLoading(false);
      }
    };

    enhanceAdvice();
  }, [history]);

  if (!diagnosis) return null;

  return (
    <div className="space-y-8">
      {/* 🧠 Diagnóstico general */}
      <DiagnosisCard
        diagnosis={diagnosis}
        isAIAdvice={false} // Deshabilitado, no hay IA
        aiAdvice={null} // No pasamos IA
      />

      {/* 🤖 Estado IA */}
      {loading && (
        <p className="text-sm text-slate-400 italic">
          Analizando tu consumo con IA…
        </p>
      )}

      {/* 🎯 Consejos */}
      <div className="grid gap-6 md:grid-cols-2">
        {adviceList.map((advice) => (
          <AdviceCard
            key={advice.id}
            advice={advice} // Usamos los consejos base, no la IA
            isAIAdvice={false} // No marcar como IA
          />
        ))}
      </div>
      <div className="pt-10 border-t border-slate-100">
        <Achievements history={history} />
      </div>
    </div>
  );
};

export default AdvicePage;
