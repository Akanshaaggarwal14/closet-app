export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Weather-derived season bucket. Deliberately coarser than the app's
 * 4-value Season type — temperature alone can't distinguish Spring from
 * Fall, so that ambiguity is represented explicitly rather than guessed.
 * See lib/utils/season.ts for how this maps onto clothing item seasons.
 */
export type WeatherSeason = "Summer" | "Spring/Autumn" | "Winter";

export interface WeatherData {
  temperature: number; // Celsius
  condition: string;
  weatherCode: number;
  location: string;
  season: WeatherSeason;
}

export interface LocationResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
