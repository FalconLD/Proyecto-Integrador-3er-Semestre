import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Trophy, TrendingDown, Calendar } from 'lucide-react';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function Dashboard({ history }) {
  // Preparar datos para la gráfica (últimos 7 registros)
  const lastSeven = [...history].reverse().slice(-7);
  
  const chartData = {
    labels: lastSeven.map(item => item.fecha),
    datasets: [
      {
        fill: true,
        label: 'Litros Consumidos',
        data: lastSeven.map(item => item.total),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Cálculo de promedio para feedback
  const average = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.total, 0) / history.length) 
    : 0;

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tarjeta de Gráfica */}
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="text-blue-500" /> Tendencia Semanal
          </h3>
        </div>
        {history.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 italic">
            Registra tu primer consumo para ver la gráfica
          </div>
        )}
      </div>

      {/* Tarjeta de Estadísticas Rápidas */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-blue-200" />
            <span className="text-sm font-medium opacity-80">Promedio Diario</span>
          </div>
          <p className="text-3xl font-bold">{average} L</p>
          <p className="text-xs mt-2 opacity-70">Objetivo OMS: 150L</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Historial Reciente</span>
          </div>
          <ul className="space-y-3">
            {history.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                <span className="text-slate-500">{item.fecha}</span>
                <span className="font-semibold text-blue-600">{item.total}L</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}