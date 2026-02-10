import { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getWeeklyConsumption } from "../utils/analytics";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const ProgressChart = ({ history }) => {
  if (!history || history.length < 2) return null;

  const weeklyData = getWeeklyConsumption(history);

  const labels = weeklyData.map(d => d.label);
  const dataPoints = weeklyData.map(d => d.total);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Consumo semanal (L)",
        data: dataPoints,
        borderColor: "#1e40af",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, "rgba(30,64,175,0.3)");
          gradient.addColorStop(1, "rgba(30,64,175,0.05)");
          return gradient;
        },
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: "#1e3a8a",
        pointHoverBackgroundColor: "#3b82f6",
        pointBorderWidth: 0,
      },
    ],
  }), [labels, dataPoints]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { font: { size: 14 }, color: "#1f2937" },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#374151",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 6,
        titleFont: { weight: "bold" },
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} L`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#4b5563", stepSize: 100 },
        grid: { color: "rgba(107,114,128,0.1)" },
        title: { display: true, text: "Litros", color: "#6b7280" },
      },
      x: {
        ticks: { color: "#4b5563" },
        grid: { color: "rgba(107,114,128,0.05)" },
        title: { display: true, text: "Semanas", color: "#6b7280" },
      },
    },
  }), []);

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
