import { removeBackground } from "@imgly/background-removal";

/**
 * The only place UI code touches background removal. Runs entirely in the
 * browser via WASM — no server round trip, no cloud API, and the photo
 * itself never leaves the device. On first use the browser fetches the
 * model weights (not your images) from IMG.LY's CDN, then caches them for
 * subsequent uses.
 */
export async function removeImageBackground(source: File | Blob): Promise<Blob> {
  return removeBackground(source);
}
