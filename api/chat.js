import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const { systemPrompt, messages } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const input = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input,
    });

    return res.status(200).json({
      reply: response.output_text || "Try again",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
