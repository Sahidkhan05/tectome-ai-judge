import OpenAI from "openai"; // npm install openai

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { message, problemContext, code, language } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json({
        reply: "AI Mentor is currently offline. Please configure OPENROUTER_API_KEY in your environment."
      });
    }

    if (!message || !problemContext) {
      return Response.json({ reply: "Missing required fields." }, { status: 400 });
    }

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const systemPrompt = `You are an AI coding mentor inside a LeetCode-style platform.

Your job:
- Give only a small conceptual hint.
- Explain the problem briefly if needed.
- Guide the user toward the correct approach.
- Do NOT provide full code.
- Do NOT provide exact implementation.
- Do NOT reveal the final answer.
- Keep responses short and beginner-friendly.

Problem:
${problemContext}

User Code:
${code || "No code provided yet."}

Language:
${language || "Not specified."}`;

    const result = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // OpenRouter model name
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    const text = result.choices[0].message.content;

    return Response.json({ reply: text });

  } catch (err) {
    console.error("OpenRouter API Error:", {
      message: err.message,
      stack: err.stack,
      status: err.status,
    });
    return Response.json(
      { reply: "Sorry, I'm having trouble processing your request right now." },
      { status: 500 }
    );
  }
}