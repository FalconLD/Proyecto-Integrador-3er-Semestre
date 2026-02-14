import { useEffect, useState } from "react";
import ProgressChart from "./ProgressChart";
import AdvicePage from "./AdvicePage";
import { getAverage, getMinDay, getMaxDay, getWeeklyConsumption } from "../utils/analytics";
import { Trophy, TrendingDown, Calendar, Flame, Loader } from "lucide-react";
import { api } from "../services/api";

const ProgressPage = ({ user, history = [], loadingHistory = false, onGoToDashboard }) => {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    api.rachas
      .getByUsuario(user.id)
      .then((data) => setStreak(data || null))
      .catch(() => setStreak(null));
  }, [user?.id]);

  if (loadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader className="animate-spin text-blue-600" size={48} />
        <p className="text-gray-500">Cargando tus datos de consumo...</p>
      </div>
    );
  }

  if (!history || history.length < 2) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">¡Bienvenido a WaterMark!</h2>
        <p className="text-slate-400">
          Aún no tienes suficientes registros para mostrar gráficas.
        </p>
        <p className="text-sm text-blue-500">
          Comienza registrando tu consumo diario en la página principal.
        </p>
        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="mt-4 px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Ir al inicio y registrar consumo
          </button>
        )}
      </div>
    );
  }

  const average = getAverage(history);
  const minDay = getMinDay(history);
  const maxDay = getMaxDay(history);

  const weeklyData = getWeeklyConsumption(history);
  const latestWeek = weeklyData[weeklyData.length - 1] || { total: 0, estimated: false };

  return (
    <div className="space-y-12 animate-fade-in-up">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Progreso
        </h1>
        <p className="text-gray-400 mt-1 text-lg">
          Evolución histórica de tu consumo de agua
        </p>
        <div className="w-24 h-1 mx-auto bg-gray-300 rounded-full mt-3"></div>
      </header>

      {/* Sección de Métricas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Metric 
          title="Promedio" 
          value={`${average} L`} 
          color="from-gray-200 to-gray-100" 
          icon={<Trophy className="text-gray-400" />} 
        />
        <Metric 
          title="Mejor día" 
          value={`${minDay.total} L`}
          subtitle={minDay.fecha ? new Date(minDay.fecha).toLocaleDateString() : '-'} 
          color="from-green-100 to-green-50" 
          icon={<Calendar className="text-green-400" />} 
        />
        <Metric 
          title="Mayor Consumo" 
          value={`${maxDay.total} L`} 
          subtitle={maxDay.fecha ? new Date(maxDay.fecha).toLocaleDateString() : '-'} 
          color="from-red-100 to-red-50" 
          icon={<TrendingDown className="text-red-400" />} 
        />
        <Metric 
          title="Última semana" 
          value={`${latestWeek.total} L`} 
          subtitle={latestWeek.estimated ? "Estimada" : "Real"} 
          color="from-blue-100 to-blue-50" 
          icon={<Calendar className="text-blue-400" />} 
        />
        
        {streak && (
          <Metric
            title="Racha actual"
            value={`${streak.currentStreak || 0} días`}
            subtitle={`Máxima: ${streak.maxStreak || 0} días`}
            color="from-amber-100 to-orange-50"
            icon={<Flame className="text-amber-500" />}
          />
        )}
      </section>

      {/* Gráfico de tendencia */}
      <div className="bg-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">
          Tendencia Semanal de Consumo
        </h3>
        <ProgressChart history={history} />
      </div>

      {/* Alianza Eco */}
      {streak?.alliance && streak.alliance.miembros && streak.alliance.miembros.length > 1 && (
        <section className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Alianza Eco (consumos similares)
          </h3>
          <p className="text-xs text-slate-500">
            Comparativa con usuarios en tu mismo rango de consumo.
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {streak.alliance.miembros.map((m) => (
              <li key={m.usuarioId} className="flex justify-between border-b border-slate-50 pb-1 last:border-none">
                <span>{m.nombre}</span>
                <span className="text-slate-500 text-xs">{m.avgConsumption} L/día</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sección de Consejos Locales (Sin botón de IA) */}
      <section className="space-y-6">
        <div className="border-t border-gray-100 pt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Recomendaciones del Sistema</h3>
          <AdvicePage history={history} />
        </div>
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