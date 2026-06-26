
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const API_KEY = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Eres experto en HubSpot y Laravel. Mejora esta nota: ${prompt}` }] }]
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  return NextResponse.json({ response: text });
}
