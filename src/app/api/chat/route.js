import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message, problemContext, code, language } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        reply: "AI Mentor is currently offline. Please configure GEMINI_API_KEY in your environment."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.OPENROUTER_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", });

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

    const prompt = `${systemPrompt}\n\nUser Question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ reply: text });
  } catch (err) {
    console.error("Gemini API Error details:", {
      message: err.message,
      stack: err.stack,
      status: err.status,
    });
    return Response.json({ reply: "Sorry, I'm having trouble processing your request right now. Check logs for details." }, { status: 500 });
  }
}
