import { useState } from "react";
import ProgressChart from "../pages/ProgressChart";
import AdvicePage from "../pages/AdvicePage";
import { getAverage, getMinDay, getMaxDay, getTrend, getWeeklyConsumption } from "../utils/analytics";
import { Trophy, TrendingDown, Calendar, Brain } from "lucide-react";

const ProgressPage = ({ history }) => {
  const [showAdvice, setShowAdvice] = useState(false);

  if (!history || history.length < 2) {
    return (
      <p className="text-center text-slate-400 mt-10">
        No hay datos suficientes todavía.
      </p>
    );
  }

  const average = getAverage(history);
  const minDay = getMinDay(history);
  const maxDay = getMaxDay(history);
  const trend = getTrend(history);

  // Obtener consumo semanal
  const weeklyData = getWeeklyConsumption(history);
  const latestWeek = weeklyData[weeklyData.length - 1];

  return (
    <div className="space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Progreso
        </h1>
        <p className="text-gray-400 mt-1 text-lg">
          Evolución histórica de tu consumo de agua
        </p>
        <div className="w-24 h-1 mx-auto bg-gray-300 rounded-full mt-3"></div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Metric title="Promedio" value={`${average} L`} color="from-gray-200 to-gray-100" icon={<Trophy className="text-gray-400" />} />
        <Metric title="Mejor día" value={`${maxDay.total} L`} subtitle={maxDay.fecha} color="from-green-100 to-green-50" icon={<Calendar className="text-green-400" />} />
        <Metric title="Peor día" value={`${minDay.total} L`} subtitle={minDay.fecha} color="from-red-100 to-red-50" icon={<TrendingDown className="text-red-400" />} />
        <Metric title="Última semana" value={`${latestWeek.total} L`} subtitle={latestWeek.estimated ? "Estimada" : "Real"} color="from-blue-100 to-blue-50" icon={<Calendar className="text-blue-400" />} />
      </section>

      <div className="bg-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">
          Tendencia Semanal de Consumo
        </h3>
        <ProgressChart history={history} />
      </div>

      <section className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Brain size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black">
                Análisis Inteligente
              </h3>
              <p className="opacity-90 mt-1">
                Interpretación personalizada de tu consumo de agua
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdvice(!showAdvice)}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
          >
            {showAdvice ? "Ocultar análisis" : "Ver consejos personalizados"}
          </button>
        </div>

        {showAdvice && (
          <div className="animate-fade-in">
            <AdvicePage history={history} />
          </div>
        )}
      </section>
    </div>
  );
};

const Metric = ({ title, value, subtitle, color, icon }) => (
  <div className={`flex flex-col p-5 rounded-2xl shadow-sm bg-gradient-to-br ${color} transition hover:scale-105`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-600">
        {title}
      </p>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

export default ProgressPage;
