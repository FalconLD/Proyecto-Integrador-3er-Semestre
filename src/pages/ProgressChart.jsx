// ProgressChart.jsx
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
  if (!history || history.length === 0) return null;

  const lastSeven = history.slice(-7);

  const labels = lastSeven.map((d) => {
    const dateStr = d.date || d.fecha;
    if (!dateStr) return "Fecha desconocida";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`).toLocaleDateString();
    }
    return new Date(dateStr).toLocaleDateString();
  });

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Consumo diario (ml)",
          data: lastSeven.map((d) => d.total ?? 0),
          borderColor: "#1e40af", // azul profundo visible
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
            gradient.addColorStop(0, "rgba(30,64,175,0.3)"); // top
            gradient.addColorStop(1, "rgba(30,64,175,0.05)"); // bottom
            return gradient;
          },
          pointRadius: 6,
          pointHoverRadius: 9,
          pointBackgroundColor: "#1e3a8a",
          pointHoverBackgroundColor: "#3b82f6",
          pointBorderWidth: 0,
        },
      ],
    }),
    [lastSeven, labels]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 1000, easing: "easeOutQuart" },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: { font: { size: 14 }, color: "#1f2937" }, // gris oscuro para contraste
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          backgroundColor: "#374151", // tooltip gris oscuro
          titleColor: "#f9fafb",
          bodyColor: "#f9fafb",
          padding: 10,
          cornerRadius: 6,
          titleFont: { weight: "bold" },
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} ml`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#4b5563", stepSize: 100 },
          grid: { color: "rgba(107,114,128,0.1)" },
          title: { display: true, text: "Mililitros", color: "#6b7280" },
        },
        x: {
          ticks: { color: "#4b5563" },
          grid: { color: "rgba(107,114,128,0.05)" },
          title: { display: true, text: "Fecha", color: "#6b7280" },
        },
      },
    }),
    []
  );

  return (
    <div className="w-full h-96">
      <Line data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
