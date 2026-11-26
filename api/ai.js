// Vercel serverless function using the FREE Google Gemini API.
// The key stays on the server as an environment variable.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY is not set on the server" });
  const prompt = (req.body && req.body.prompt) || "";
  if (!prompt || prompt.length > 30000) return res.status(400).json({ error: "Prompt missing or too long" });
  const model = process.env.MODEL || "gemini-3.5-flash-lite";
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: (d.error && d.error.message) || "API error" });
    const parts = (d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || [];
    res.status(200).json({ text: parts.map(p => p.text || "").join("") });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};  
