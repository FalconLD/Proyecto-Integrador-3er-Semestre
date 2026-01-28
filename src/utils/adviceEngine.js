const OMS_LIMIT = 150;

export const getAdviceFromHistory = (history) => {
  if (!history.length) return null;

  const last7 = history.slice(0, 7);
  const average =
    last7.reduce((sum, r) => sum + r.total, 0) / last7.length;

  // ======================
  // DIAGNÓSTICO
  // ======================
  let diagnosis = {};

  if (average <= OMS_LIMIT) {
    diagnosis = {
      title: "Buen control de tu consumo de agua 💧",
      description:
        "Tu consumo promedio está dentro de los rangos recomendados por la OMS. ¡Buen trabajo!",
      level: "good",
    };
  } else if (average <= OMS_LIMIT + 20) {
    diagnosis = {
      title: "Consumo ligeramente elevado ⚠️",
      description:
        "Estás un poco por encima del consumo recomendado. Con pequeños cambios puedes mejorar fácilmente.",
      level: "warning",
    };
  } else {
    diagnosis = {
      title: "Consumo elevado 🚨",
      description:
        "Tu consumo supera claramente el valor recomendado. Es importante tomar acción.",
      level: "danger",
    };
  }

  // ======================
  // CONSEJOS BASE
  // ======================
  const advices = [];

  if (average > OMS_LIMIT) {
    advices.push({
      id: "shower",
      title: "Reduce el tiempo de ducha",
      text:
        "Acortar tu ducha en solo 2 minutos puede representar un ahorro significativo de agua cada día.",
      impact: "≈ 18 L/día",
    });
  }

  advices.push({
    id: "awareness",
    title: "Mantén constancia diaria",
    text:
      "Registrar tu consumo con regularidad te ayuda a identificar hábitos y mejorar progresivamente.",
    impact: "Mejora sostenida",
  });

  if (average <= OMS_LIMIT) {
    advices.push({
      id: "reinforcement",
      title: "Sigue con tus buenos hábitos",
      text:
        "Tu consumo actual es responsable. Mantén estas prácticas para contribuir al cuidado del agua.",
      impact: "Impacto positivo continuo",
    });
  }

  return {
    average: Math.round(average),
    diagnosis,
    advices,
  };
};
