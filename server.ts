import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Initialize Database
const db = new Database("cantadas.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS ai_generations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT,
    response TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// API Routes
app.post("/api/generate", async (req, res) => {
  const { category, context } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  try {
    const prompt = `Você é um especialista em cantadas criativas, respeitosas e divertidas em português do Brasil.
    Gere 3 cantadas originais para a categoria: "${category}".
    Contexto adicional: ${context || "Nenhum"}.
    
    Responda APENAS com um array JSON de strings, sem formatação markdown ou explicações.
    Exemplo: ["cantada 1", "cantada 2", "cantada 3"]`;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = response.text;
    let lines: string[] = [];
    
    try {
      // Clean up potential markdown formatting if the model ignored instructions
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      lines = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      return res.status(500).json({ error: "Falha ao processar resposta da IA" });
    }

    // Store in DB
    const insert = db.prepare("INSERT INTO ai_generations (prompt, response, category) VALUES (?, ?, ?)");
    insert.run(prompt, JSON.stringify(lines), category);

    res.json({ lines });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Erro ao gerar cantadas com IA" });
  }
});

app.get("/api/stats", (req, res) => {
  try {
    const stats = db.prepare("SELECT COUNT(*) as count FROM ai_generations").get() as { count: number };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
