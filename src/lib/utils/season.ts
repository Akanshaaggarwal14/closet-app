import type { Season } from "@/types";
import type { WeatherSeason } from "@/services/weather/weatherTypes";

/**
 * Approximates the current season from the device's local month, assuming
 * the Northern Hemisphere. Used only as a fallback in the Closet's "This
 * season" filter when real weather data isn't available yet (still
 * loading, geolocation denied with no manual city set, etc.) — the
 * primary path is seasonsForWeather() below, driven by useWeather().
 */
export function getApproximateSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-indexed
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

/**
 * Maps a weather-derived season bucket to the clothing Season values it
 * should match. "Spring/Autumn" can't be resolved to one or the other from
 * temperature alone, so it matches items tagged with either.
 */
export function seasonsForWeather(weatherSeason: WeatherSeason): Season[] {
  switch (weatherSeason) {
    case "Summer":
      return ["Summer"];
    case "Winter":
      return ["Winter"];
    case "Spring/Autumn":
      return ["Spring", "Fall"];
  }
}
