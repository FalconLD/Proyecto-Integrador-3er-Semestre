// analytics.js

// Promedio diario
export const getAverage = (history) => {
  const sum = history.reduce((acc, d) => acc + d.total, 0);
  return Math.round(sum / history.length);
};

// Mejor día
export const getMaxDay = (history) => {
  return history.reduce((max, d) => (d.total > max.total ? d : max));
};

// Peor día
export const getMinDay = (history) => {
  return history.reduce((min, d) => (d.total < min.total ? d : min));
};

// Tendencia simple
export const getTrend = (history) => {
  if (history.length < 2) return "Sin datos";

  const first = history[0].total;
  const last = history[history.length - 1].total;

  if (last > first) return "📈 Ascendente";
  if (last < first) return "📉 Descendente";
  return "➡️ Estable";
};

// Consumo semanal (nuevo)
export const getWeeklyConsumption = (history) => {
  if (!history || history.length < 2) return [];

  // Ordenar por fecha
  const sorted = [...history].sort(
    (a, b) => new Date(a.fechaISO) - new Date(b.fechaISO)
  );

  if (sorted.length < 7) {
    const total = sorted.reduce((sum, d) => sum + d.total, 0);
    const avgPerDay = total / sorted.length;
    return [
      {
        label: "Aproximación semanal",
        total: Math.round(avgPerDay * 7),
        estimated: true,
      },
    ];
  }

  const weeks = [];
  let currentWeek = [];

  sorted.forEach((day, index) => {
    currentWeek.push(day);

    if (currentWeek.length === 7 || index === sorted.length - 1) {
      const weekTotal = currentWeek.reduce((sum, d) => sum + d.total, 0);
      weeks.push({
        label: `Semana ${weeks.length + 1}`,
        total: weekTotal,
        estimated: currentWeek.length < 7,
      });
      currentWeek = [];
    }
  });

  return weeks;
};
