import { useEffect, useState } from "react";
import DiagnosisCard from "../components/DiagnosisCard";
import AdviceCard from "../components/AdviceCard";
import { getAdviceFromHistory } from "../utils/adviceEngine";
import { enhanceAdviceWithAI } from "../utils/adviceAI";

const AdvicePage = ({ history }) => {
  const [diagnosis, setDiagnosis] = useState(null);
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!history || history.length === 0) return;

    const result = getAdviceFromHistory(history);
    setDiagnosis(result.diagnosis);
    setAdviceList(result.advices);

    // 🤖 IA (opcional, no bloquea)
    const enhanceAdvice = async () => {
      setLoading(true);

      try {
        const enhanced = await Promise.all(
          result.advices.map((advice) =>
            enhanceAdviceWithAI({
              average: result.average,
              diagnosis: result.diagnosis,
              advice,
            })
          )
        );

        setAdviceList(enhanced);
      } catch (e) {
        // fallback automático (ya están los consejos base)
        console.warn("IA no disponible, usando consejos base");
      } finally {
        setLoading(false);
      }
    };

    enhanceAdvice();
  }, [history]);

  if (!diagnosis) return null;

  return (
    <div className="space-y-8">
      <DiagnosisCard diagnosis={diagnosis} />

      {loading && (
        <p className="text-sm text-slate-400 italic">
          Analizando tu consumo con IA…
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {adviceList.map((advice, index) => (
          <AdviceCard key={index} advice={advice} />
        ))}
      </div>
    </div>
  );
};

export default AdvicePage;
