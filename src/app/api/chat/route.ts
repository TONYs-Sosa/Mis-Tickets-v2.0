import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "API Key no configurada" }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Eres experto en HubSpot y Laravel. Mejora esta nota técnica: ${prompt}` }] }]
        }),
      }
    );

    const data = await response.json();
    
    // Verificamos si la respuesta de Google trae el texto
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
    } else {
      return NextResponse.json({ error: "Error en la respuesta de Google", details: data }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor", details: error }, { status: 500 });
  }
}
