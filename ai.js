// Vercel serverless function: keeps the API key on the server.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server" });
  const prompt = (req.body && req.body.prompt) || "";
  if (!prompt || prompt.length > 30000) return res.status(400).json({ error: "Prompt missing or too long" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.MODEL || "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const d = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: (d.error && d.error.message) || "API error" });
    const text = (d.content || []).map(c => c.text || "").join("");
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
