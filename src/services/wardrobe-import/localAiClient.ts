import type { DetectedClothingItem } from "./importTypes";

/**
 * The only place client code talks to the wardrobe-import pipeline. Calls
 * our own /api/wardrobe-import/detect route, which proxies to the local
 * Python AI service — never calls localhost:8008 directly from the
 * browser, and never uploads images to any third-party service.
 */
export async function detectClothingItems(file: File): Promise<DetectedClothingItem[]> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/wardrobe-import/detect", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Couldn't process this image");
  }

  const data = (await response.json()) as { items: Omit<DetectedClothingItem, "id">[] };
  return data.items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));
}
