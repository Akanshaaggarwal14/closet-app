import type { WeatherSeason } from "./weatherTypes";

/**
 * Season inferred from current temperature rather than the calendar, per
 * product requirements. Deliberately simple and isolated so the
 * thresholds can be tuned (or swapped for something smarter) later
 * without touching the rest of the weather service.
 */
export function getSeasonFromTemperature(temperatureCelsius: number): WeatherSeason {
  if (temperatureCelsius > 28) return "Summer";
  if (temperatureCelsius >= 18) return "Spring/Autumn";
  return "Winter";
}
