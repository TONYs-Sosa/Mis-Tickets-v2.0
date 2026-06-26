import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "No se detectó la variable GEMINI_API_KEY en Vercel" }, { status: 500 });
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

    // Si la API de Google devuelve un error, lo pasamos al frontend
    if (!response.ok) {
      return NextResponse.json({ error: "Google API rechazó la petición", details: data }, { status: 500 });
    }

    return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
  } catch (error: any) {
    return NextResponse.json({ error: "Error en el servidor", details: error.message }, { status: 500 });
  }
}
