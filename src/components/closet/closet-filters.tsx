"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PillGroup } from "@/components/shared/pill-group";
import { CLOTHING_CATEGORIES, type ClothingCategory } from "@/types";

type CategoryFilter = ClothingCategory | "All";
const CATEGORY_OPTIONS: readonly CategoryFilter[] = ["All", ...CLOTHING_CATEGORIES];

interface ClosetFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  showAllSeasons: boolean;
  onShowAllSeasonsChange: (value: boolean) => void;
  /** e.g. "Summer" — shown on the toggle once weather has resolved a season. */
  currentSeasonLabel?: string;
}

export function ClosetFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  showAllSeasons,
  onShowAllSeasonsChange,
  currentSeasonLabel,
}: ClosetFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your closet"
            className="pl-9"
          />
        </div>

        <div className="flex overflow-hidden rounded-full border border-border text-sm">
          <button
            type="button"
            onClick={() => onShowAllSeasonsChange(true)}
            className={
              showAllSeasons
                ? "bg-primary px-3.5 py-1.5 text-primary-foreground"
                : "px-3.5 py-1.5 text-muted-foreground hover:bg-accent"
            }
          >
            All clothes
          </button>
          <button
            type="button"
            onClick={() => onShowAllSeasonsChange(false)}
            className={
              !showAllSeasons
                ? "bg-primary px-3.5 py-1.5 text-primary-foreground"
                : "px-3.5 py-1.5 text-muted-foreground hover:bg-accent"
            }
          >
            {currentSeasonLabel ? `This season (${currentSeasonLabel})` : "This season"}
          </button>
        </div>
      </div>

      <PillGroup
        options={CATEGORY_OPTIONS}
        value={[categoryFilter]}
        onToggle={(value) => onCategoryChange(value)}
      />
    </div>
  );
}
