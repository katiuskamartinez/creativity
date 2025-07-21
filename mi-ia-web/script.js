document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("promptInput");
  const generateBtn = document.getElementById("generateBtn");
  const responseOutput = document.getElementById("responseOutput");
  const loadingMessage = document.getElementById("loading");
  const errorMessage = document.getElementById("error");

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      errorMessage.textContent = "Por favor, introduce una pregunta o prompt.";
      errorMessage.classList.remove("hidden");
      responseOutput.innerHTML =
        "<p>Aquí aparecerá la respuesta generada por la IA.</p>"; //
      return;
    }

    // Limpiar mensajes anteriores y mostrar carga
    errorMessage.classList.add("hidden");
    responseOutput.innerHTML = "";
    loadingMessage.classList.remove("hidden");

    try {
      // Realizar la petición al backend
      const response = await fetch("http://localhost:3000/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      responseOutput.innerHTML = `<p>${data.generatedText}</p>`;
    } catch (error) {
      console.error("Error al generar texto:", error);
      errorMessage.textContent = `Error: ${error.message}. Asegúrate de que tu servidor backend esté corriendo y sea accesible.`;
      errorMessage.classList.remove("hidden");
      responseOutput.innerHTML =
        "<p>Hubo un problema al obtener la respuesta.</p>";
    } finally {
      loadingMessage.classList.add("hidden"); // Ocultar mensaje de carga
    }
  });
});
