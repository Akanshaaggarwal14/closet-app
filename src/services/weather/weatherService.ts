import { getSeasonFromTemperature } from "./getSeasonFromTemperature";
import { reverseGeocode } from "./locationService";
import { describeWeatherCode } from "./weatherCodes";
import type { Coordinates, LocationResult, WeatherData } from "./weatherTypes";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes — avoids re-fetching on every page nav

interface OpenMeteoForecastResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

interface OpenMeteoGeocodingResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

let cachedWeather: { data: WeatherData; expiresAt: number } | null = null;

/**
 * The only place in the app that talks to Open-Meteo (or the reverse
 * geocoder). UI components go through this service — never fetch()
 * directly against a weather API from a component.
 */
export async function getCurrentWeather(
  coords: Coordinates,
  knownLocationName?: string,
): Promise<WeatherData> {
  if (!knownLocationName && cachedWeather && cachedWeather.expiresAt > Date.now()) {
    return cachedWeather.data;
  }

  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(coords.latitude));
  url.searchParams.set("longitude", String(coords.longitude));
  url.searchParams.set("current", "temperature_2m,weather_code");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Couldn't fetch weather data");
  }

  const json = (await response.json()) as OpenMeteoForecastResponse;
  const temperature = json.current.temperature_2m;
  const weatherCode = json.current.weather_code;

  const location = knownLocationName ?? (await reverseGeocode(coords));

  const data: WeatherData = {
    temperature,
    condition: describeWeatherCode(weatherCode),
    weatherCode,
    location,
    season: getSeasonFromTemperature(temperature),
  };

  cachedWeather = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}

/** Forward geocoding (city name -> coordinates) for the manual-location fallback. */
export async function searchLocationByName(query: string): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "5");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Couldn't search locations");
  }

  const json = (await response.json()) as { results?: OpenMeteoGeocodingResult[] };
  return (json.results ?? []).map((result) => ({
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}
