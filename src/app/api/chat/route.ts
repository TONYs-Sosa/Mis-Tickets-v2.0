import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Mejora esta nota técnica de HubSpot y Laravel: " + prompt }] }]
      }),
    });

    const data = await res.json();

    // AQUÍ ESTÁ EL CAMBIO: Si algo falla, devolvemos el objeto 'data' completo
    if (!res.ok) {
      return NextResponse.json({ error: "Error de Google", details: data }, { status: 500 });
    }

    return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
  } catch (err: any) {
    return NextResponse.json({ error: "Error en servidor", details: err.message }, { status: 500 });
  }
}
