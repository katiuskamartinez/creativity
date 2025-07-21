require("dotenv").config(); // Carga las variables de entorno al inicio
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai"); //

const app = express();
const port = process.env.PORT || 3000; // Puedes configurar el puerto

// Middleware
app.use(cors()); // Habilita CORS para que tu frontend pueda hacer peticiones
app.use(express.json()); // Habilita el parsing de JSON en el cuerpo de las peticiones

// Inicializa el modelo de IA de Google
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Ruta para generar texto
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "El prompt es requerido." });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ generatedText: text });
  } catch (error) {
    console.error("Error al comunicarse con la API de Google AI:", error);
    res.status(500).json({
      error: "Error al generar la respuesta de la IA.",
      details: error.message,
    });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
