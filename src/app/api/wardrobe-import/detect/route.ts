import { NextResponse, type NextRequest } from "next/server";

const AI_SERVICE_URL = process.env.WARDROBE_AI_SERVICE_URL ?? "http://localhost:8008";

/**
 * Proxies to the local Python AI service (ai-service/, run separately via
 * `uvicorn main:app --port 8008`). This route exists so the browser only
 * ever talks to our own Next.js server — the AI service itself is never
 * exposed to client code, and never leaves localhost.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  let response: Response;
  try {
    const proxyFormData = new FormData();
    proxyFormData.append("file", file);
    response = await fetch(`${AI_SERVICE_URL}/detect`, {
      method: "POST",
      body: proxyFormData,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Couldn't reach the local AI service. Make sure it's running — see ai-service/README.md.",
      },
      { status: 503 },
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    return NextResponse.json(
      { error: body?.detail ?? "The AI service couldn't process this image" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
