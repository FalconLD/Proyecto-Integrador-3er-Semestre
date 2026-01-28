export const enhanceAdviceWithAI = async ({
  average,
  diagnosis,
  advice,
}) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `
Usuario consume ${average} litros diarios.
Diagnóstico: ${diagnosis.title}.
Consejo base: ${advice.title} - ${advice.text}

Redacta un consejo corto, claro y motivador (máx 2 frases).
          `,
        }),
      }
    );

    const data = await response.json();

    const generatedText =
      Array.isArray(data) && data[0]?.generated_text;

    return {
      ...advice,
      text: generatedText || advice.text,
    };
  } catch (error) {
    // fallback total
    return advice;
  }
};
