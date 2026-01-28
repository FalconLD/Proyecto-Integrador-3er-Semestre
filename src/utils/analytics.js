export const getAverage = (history) => {
  const sum = history.reduce((acc, d) => acc + d.total, 0);
  return Math.round(sum / history.length);
};

export const getMinDay = (history) => {
  return history.reduce((min, d) =>
    d.total < min.total ? d : min
  );
};

export const getMaxDay = (history) => {
  return history.reduce((max, d) =>
    d.total > max.total ? d : max
  );
};

// Tendencia ultra simple
export const getTrend = (history) => {
  if (history.length < 2) return "Sin datos";

  const first = history[0].total;
  const last = history[history.length - 1].total;

  if (last > first) return "📈 Ascendente";
  if (last < first) return "📉 Descendente";
  return "➡️ Estable";
};
