export function getAdviceFromHistory(history) {
  // 🔹 Validación inicial
  if (!history || history.length === 0) {
    return {
      average: 0,
      diagnosis: "Sin datos suficientes para generar diagnóstico.",
      advices: [],
      worstDay: 0,
      habits: {}
    };
  }

  const days = history.length;

  // 🔹 Inicializamos acumuladores
  let total = 0;
  let virtualTotal = 0;
  let showerTotal = 0;
  let coffeeTotal = 0;
  let worstDay = history[0];

  for (const day of history) {
    total += day.total;
    virtualTotal += day.virtualTotal;
    showerTotal += day.details.showerTime;
    coffeeTotal += day.details.coffeeTazas;

    if (day.total > worstDay.total) {
      worstDay = day;
    }
  }

  const average = Math.round(total / days);
  const virtualAverage = Math.round(virtualTotal / days);
  const avgShower = Math.round(showerTotal / days);
  const avgCoffee = Math.round(coffeeTotal / days);
  const lastMeat = history[history.length - 1].details.meatConsumption;

  // 🔹 Diagnóstico general
  let diagnosis = "Tu consumo de agua está dentro de un rango equilibrado.";

  if (average > 180) {
    diagnosis = "Tu consumo de agua es elevado comparado con un uso doméstico eficiente.";
  } else if (average < 120) {
    diagnosis = "Tu consumo de agua es bajo, lo cual indica hábitos eficientes.";
  }

  // 🔹 Consejos base
  const advices = [];

  if (avgShower > 7) {
    advices.push({
      id: "shower",
      title: "Reducí el tiempo de ducha",
      text: "Tus duchas son más largas de lo recomendado.",
      impact: "Ahorrás hasta 24L por minuto reducido."
    });
  }

  if (virtualAverage > average) {
    advices.push({
      id: "virtual",
      title: "Prestá atención a la huella virtual",
      text: "Tu alimentación impacta más que tu consumo directo.",
      impact: "Pequeños cambios semanales generan gran ahorro."
    });
  }

  if (avgCoffee > 2) {
    advices.push({
      id: "coffee",
      title: "Moderá el consumo de café",
      text: "El café tiene una huella hídrica elevada.",
      impact: "Reducir una taza diaria ahorra ~140L virtuales."
    });
  }

  if (lastMeat === "alto") {
    advices.push({
      id: "meat",
      title: "Reducí la carne roja",
      text: "El consumo frecuente de carne aumenta tu huella hídrica.",
      impact: "Un día sin carne ahorra miles de litros virtuales."
    });
  }

  // fallback mínimo
  if (advices.length === 0) {
    advices.push({
      id: "keep",
      title: "Mantené tus buenos hábitos",
      text: "Tu consumo es estable y responsable.",
      impact: "Seguir así mantiene tu huella bajo control."
    });
  }

  return {
    average,
    diagnosis,
    advices,
    worstDay: worstDay.total,
    habits: {
      avgShower,
      avgCoffee,
      meat: lastMeat
    }
  };
}
