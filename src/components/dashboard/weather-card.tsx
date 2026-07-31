"use client";

import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/hooks/useWeather";
import type { LocationResult } from "@/services/weather/weatherTypes";

export function WeatherCard() {
  const { weather, status, setManualLocation, searchLocations } = useWeather();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSearching(true);
    const found = await searchLocations(query);
    setResults(found);
    setSearching(false);
  }

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      {status === "idle" || status === "loading" ? (
        <div className="space-y-2">
          <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
        </div>
      ) : status === "success" && weather ? (
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">
              {Math.round(weather.temperature)}°C
            </span>
            <span className="text-muted-foreground">{weather.condition}</span>
          </div>
          <p className="text-sm text-muted-foreground">{weather.location}</p>
          <p className="text-sm">
            Showing your <span className="font-medium">{weather.season}</span> wardrobe
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {status === "denied"
              ? "Location access is off — enter your city to see local weather."
              : "Couldn't load weather — try entering your city."}
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city"
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={searching || !query.trim()}>
              {searching ? "Searching…" : "Search"}
            </Button>
          </form>
          {results.length > 0 && (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {results.map((result) => (
                <li key={`${result.name}-${result.latitude}-${result.longitude}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setManualLocation(result);
                      setResults([]);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    {result.name}
                    {result.admin1 ? `, ${result.admin1}` : ""}
                    {result.country ? `, ${result.country}` : ""}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
