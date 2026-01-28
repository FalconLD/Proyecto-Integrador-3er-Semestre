import { useEffect, useState } from 'react';
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
import { Trophy, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

export default function DashboardPremium({ history }) {
  const [animatedData, setAnimatedData] = useState([]);
  const [trendColors, setTrendColors] = useState([]);

  const lastSeven = [...history].reverse().slice(-7);

  // Animación de línea y color por tendencia
  useEffect(() => {
    if (history.length === 0) return;
    const tempData = Array(lastSeven.length).fill(0);
    const tempColors = Array(lastSeven.length).fill('#2563eb');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < lastSeven.length) {
        tempData[idx] = lastSeven[idx].total;
        if (idx === 0) tempColors[idx] = '#2563eb';
        else tempColors[idx] = tempData[idx] >= tempData[idx - 1] ? '#10b981' : '#ef4444'; // verde / rojo
        setAnimatedData([...tempData]);
        setTrendColors([...tempColors]);
        idx++;
      } else clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [history]);

  const chartData = {
    labels: lastSeven.map(item => item.fecha),
    datasets: [
      {
        fill: true,
        label: 'Litros Consumidos',
        data: animatedData.length ? animatedData : lastSeven.map(i => i.total),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        tension: 0.4,
        pointBackgroundColor: trendColors.length ? trendColors : Array(lastSeven.length).fill('#2563eb'),
        pointHoverRadius: 8,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex;
            const value = context.raw;
            let arrow = '';
            if(idx > 0) {
              arrow = value > animatedData[idx-1] ? '↑' : value < animatedData[idx-1] ? '↓' : '→';
            }
            return ` ${value}L ${arrow}`;
          }
        },
        backgroundColor: '#1e3a8a',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: { color: '#334155', font: { weight: '500' } },
        grid: { color: '#f1f5f9' }
      },
      x: {
        ticks: { color: '#334155', font: { weight: '500' } },
        grid: { color: '#f1f5f9' }
      }
    }
  };

  const average = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.total, 0) / history.length) 
    : 0;

  const trend = history.length > 1
    ? history[history.length - 1].total - history[history.length - 2].total
    : 0;

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Gráfica Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-700">
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
      </motion.div>

      {/* Estadísticas Premium */}
      <div className="space-y-6">

        {/* Promedio Diario con indicador */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl text-white shadow-lg hover:scale-[1.03] transition-transform"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-blue-200" />
            <span className="text-sm font-medium opacity-80">Promedio Diario</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold">{average} L</p>
            {trend > 0 && <TrendingUp className="text-green-300" />}
            {trend < 0 && <TrendingDown className="text-red-300" />}
          </div>
          <p className="text-xs mt-2 opacity-70">Objetivo OMS: 150L</p>
        </motion.div>

        {/* Historial reciente con tendencia */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">Historial Reciente</span>
          </div>
          <ul className="space-y-2">
            {history.slice(0, 5).map((item, idx) => {
              const prev = idx > 0 ? history[idx-1].total : item.total;
              const diff = item.total - prev;
              return (
                <li 
                  key={idx} 
                  className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 hover:bg-slate-50 rounded transition-colors"
                >
                  <span className="text-slate-500">{item.fecha}</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-blue-600">{item.total}L</span>
                    {diff > 0 && <TrendingUp className="text-green-400" size={16} />}
                    {diff < 0 && <TrendingDown className="text-red-400" size={16} />}
                  </div>
                </li>
              )
            })}
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
