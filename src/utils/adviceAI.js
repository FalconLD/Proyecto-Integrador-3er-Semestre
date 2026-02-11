// export async function enhanceAdviceWithAI(context) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 15000);

//   try {
//     const res = await fetch("http://localhost:3001/api/ai-advice", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(context),
//       signal: controller.signal
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || "IA no disponible");
//     }

//     return data;

//   } finally {
//     clearTimeout(timeout);
//   }
// }
