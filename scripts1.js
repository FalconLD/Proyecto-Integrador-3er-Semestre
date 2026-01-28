
function iniciarSesion() {
  const nombre = document.getElementById("nombre").value.trim();

  if (nombre === "") {
    alert("Por favor, ingresa tu nombre");
    return;
  }

  localStorage.setItem("usuario", nombre);
  window.location.href = "index.html";
}

// Bienvenida personalizada en index.html
if (document.getElementById("bienvenida")) {
  const usuario = localStorage.getItem("usuario") || "Usuario";
  document.getElementById("bienvenida").textContent =
    "¡Hola, " + usuario + "! 👋";
}

function irCalculadora() {
  window.location.href = "calculadora.html";
}

function irInfo() {
  window.location.href = "info.html";
}

function volverInicio() {
  window.location.href = "index.html";
}

function calcularHuella() {
  // Convertir inputs a números y manejar campos vacíos
  const ducha = parseFloat(document.getElementById("ducha").value) || 0;
  const ropa = parseFloat(document.getElementById("ropa").value) || 0;
  const cocina = parseFloat(document.getElementById("cocina").value) || 0;
  const cafe = parseFloat(document.getElementById("cafe").value) || 0;

  // Validación: si todos son 0
  if (ducha === 0 && ropa === 0 && cocina === 0 && cafe === 0) {
    alert("Por favor, ingresa al menos un valor");
    return;
  }

  // Valores estimados por hábito
  const aguaDucha = ducha * 10;          // litros por minuto de ducha
  const aguaRopa = (ropa * 60) / 7;      // litros por lavado de ropa semanal
  const aguaCocina = cocina * 15;        // litros por uso de cocina
  const aguaCafe = cafe * 140;           // litros por taza de café

  // Total huella hídrica diaria
  const total = Math.round(aguaDucha + aguaRopa + aguaCocina + aguaCafe);

  // Guardar en historial localStorage
  const historial = JSON.parse(localStorage.getItem("historialConsumo")) || [];
  const fecha = new Date().toLocaleDateString();
  historial.push({ fecha, total });
  localStorage.setItem("historialConsumo", JSON.stringify(historial));

  // Guardar último resultado
  localStorage.setItem("ultimaHuella", total);

  // Mostrar resultados y actualizar historial
  mostrarResultado(total);
  mostrarHistorial();
}

function mostrarResultado(total) {
  const resultado = document.getElementById("resultado");
  const recomendacion = document.getElementById("recomendacion");

  if (isNaN(total)) {
    resultado.textContent = "⚠️ Error: valor inválido";
    recomendacion.textContent = "";
    return;
  }

  resultado.textContent = `💧 Tu huella hídrica diaria estimada es de ${total} litros`;

  const objetivo = 150; // Objetivo diario

  if (total <= objetivo) {
    resultado.style.color = "green";
    recomendacion.textContent = "🌱 Excelente. Has alcanzado tu objetivo sostenible!";
  } else if (total <= objetivo + 100) {
    resultado.style.color = "orange";
    recomendacion.textContent = `⚠️ Consumo medio. Intenta reducir ${total - objetivo} litros para alcanzar tu objetivo diario.`;
  } else {
    resultado.style.color = "red";
    recomendacion.textContent = `🚨 Consumo alto. Reduce al menos ${total - objetivo} litros para cumplir tu objetivo sostenible.`;
  }
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem("historialConsumo")) || [];
  const lista = document.getElementById("historialConsumo");

  if (!lista) return; // Si la página no tiene historial, no hacer nada

  lista.innerHTML = "";

  historial.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.fecha} → ${item.total} litros`;
    lista.appendChild(li);
  });
}

// Mostrar historial al cargar la página
if (document.getElementById("historialConsumo")) {
  mostrarHistorial();
}
