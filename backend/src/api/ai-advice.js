// import express from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash", // asegúrate de que este modelo esté disponible
// });

// router.post("/ai-advice", async (req, res) => {
//   try {
//     const { average, diagnosis, advice, context } = req.body;

//     if (!advice?.text) {
//       return res.status(400).json({ error: "Advice inválido" });
//     }

//     const prompt = `
// Eres un asesor ambiental experto en consumo doméstico de agua.

// Mejora el siguiente consejo SIN cambiar su intención.

// Reglas:
// - Sé claro y cercano
// - No culpes al usuario
// - Máx 3 líneas
// - Español neutro
// - Devuelve SOLO JSON válido

// Formato exacto:
// {
//   "text": "...",
//   "impact": "..."
// }

// Contexto:
// Promedio diario: ${average} litros
// Diagnóstico general: ${diagnosis}
// Hábitos: ${JSON.stringify(context?.habits || {})}

// Consejo base:
// "${advice.text}"
// `;

//     Generando contenido con el modelo de Gemini
//     const result = await model.generateContent(prompt, {
//      temperature: 0.3,
//      maxOutputTokens: 150, 
//     });

//     Obtener la respuesta cruda
//     const raw = result.response.text();

//     Limpiar la respuesta para eliminar bloques de código (si los hay)
//     const cleanedResponse = raw.replace(/```json|```/g, '').trim();

//     let parsed;
//     try {
//       Intentamos parsear la respuesta como JSON
//       parsed = JSON.parse(cleanedResponse);
//     } catch (err) {
//       console.error("Gemini respondió algo inválido:", raw);
//       return res.status(500).json({ error: "Respuesta IA inválida" });
//     }

//     Si todo es correcto, devolvemos la respuesta procesada
//     res.json(parsed);

//   } catch (error) {
//     console.error("Error Gemini:", error);
//     res.status(500).json({ error: "IA no disponible" });
//   }
// });

// export default router;