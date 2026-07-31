import type { Coordinates } from "./weatherTypes";

const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

/**
 * Resolves coordinates to a human-readable place name. Open-Meteo has no
 * reverse-geocoding endpoint, so this calls BigDataCloud's free, keyless
 * client-side reverse geocoding API instead — isolated in its own file so
 * it can be swapped out without touching weatherService.ts.
 */
export async function reverseGeocode(coords: Coordinates): Promise<string> {
  try {
    const url = new URL(REVERSE_GEOCODE_URL);
    url.searchParams.set("latitude", String(coords.latitude));
    url.searchParams.set("longitude", String(coords.longitude));
    url.searchParams.set("localityLanguage", "en");

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Reverse geocoding failed");

    const json = await response.json();
    return json.city || json.locality || json.principalSubdivision || "Your area";
  } catch {
    return "Your area";
  }
}
