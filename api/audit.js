
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }

  const prompt = `
You are an AI SEO expert helping businesses rank higher in LLM-powered assistants like ChatGPT, Perplexity, and Siri.
Analyze the following website and return:
- LLM Readiness Score (0–100)
- Specific Issues
- Suggested Fixes
- JSON summary block

Target URL: ${url}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
    });

    const result = completion.choices[0].message.content;
    return res.status(200).json({ audit: result });
  } catch (error) {
    console.error("Audit Error:", error);
    return res.status(500).json({ error: "Audit failed", details: error.message });
  }
}
