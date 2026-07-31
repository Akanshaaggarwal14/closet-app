"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentWeather, searchLocationByName } from "@/services/weather/weatherService";
import type { LocationResult, WeatherData } from "@/services/weather/weatherTypes";

type WeatherStatus = "idle" | "loading" | "success" | "denied" | "error";

/**
 * Orchestrates: request browser geolocation -> ask the weather service for
 * current conditions -> expose state. If geolocation is denied or
 * unavailable, status becomes "denied" so the UI can offer manual city
 * search (via searchLocations + setManualLocation) instead.
 */
export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getCurrentWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setWeather(data);
          setStatus("success");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Couldn't load weather");
          setStatus("error");
        }
      },
      () => setStatus("denied"),
      { timeout: 10000 },
    );
  }, []);

  const setManualLocation = useCallback(async (result: LocationResult) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await getCurrentWeather(
        { latitude: result.latitude, longitude: result.longitude },
        result.name,
      );
      setWeather(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load weather");
      setStatus("error");
    }
  }, []);

  return { weather, status, error, setManualLocation, searchLocations: searchLocationByName };
}
