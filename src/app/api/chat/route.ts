import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    // Usamos el modelo que te sugirió Google en el mensaje de error
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Eres experto en HubSpot y Laravel. Mejora esta nota técnica: " + prompt }] }]
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Error de Google", details: data }, { status: 500 });
    }

    return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
  } catch (err: any) {
    return NextResponse.json({ error: "Error en servidor", details: err.message }, { status: 500 });
  }
}
