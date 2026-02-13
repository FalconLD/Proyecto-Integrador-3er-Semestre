import { useEffect, useState } from "react";
import DiagnosisCard from "../components/DiagnosisCard";
import AdviceCard from "../components/AdviceCard";
import Achievements from '../components/Achievements';
import { getAdviceFromHistory } from "../utils/adviceEngine";

const AdvicePage = ({ history }) => {
  const [diagnosis, setDiagnosis] = useState(null);
  const [adviceList, setAdviceList] = useState([]);

  useEffect(() => {
    if (!history || history.length === 0) return;

    const result = getAdviceFromHistory(history);
    setDiagnosis(result.diagnosis);
    setAdviceList(result.advices);

  }, [history]);

  if (!diagnosis) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <DiagnosisCard
        diagnosis={diagnosis}
        isAIAdvice={false}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700 ml-1">Recomendaciones de Ahorro</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {adviceList.map((advice) => (
            <AdviceCard
              key={advice.id}
              advice={advice}
              isAIAdvice={false}
            />
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100">
        <Achievements history={history} />
      </div>
    </div>
  );
};

export default AdvicePage;