"use client";

import { useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toDateKey, todayDateKey } from "@/lib/utils/date";
import type { ScheduledOutfit } from "@/types";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  scheduledOutfits: ScheduledOutfit[];
  onSelectDate: (date: string) => void;
}

export function CalendarGrid({ year, month, scheduledOutfits, onSelectDate }: CalendarGridProps) {
  const scheduledByDate = useMemo(() => {
    const map = new Map<string, ScheduledOutfit>();
    for (const entry of scheduledOutfits) {
      map.set(entry.date, entry);
    }
    return map;
  }, [scheduledOutfits]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const today = todayDateKey();

  const cells: Array<{ day: number; date: string } | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      date: toDateKey(year, month, i + 1),
    })),
  ];

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) return <div key={`blank-${index}`} />;

          const scheduled = scheduledByDate.get(cell.date);
          const isToday = cell.date === today;
          const thumbnail = scheduled?.outfit.items[0];

          return (
            <button
              key={cell.date}
              type="button"
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                "flex aspect-square flex-col items-center justify-start gap-1 rounded-xl border p-1.5 text-left transition-colors hover:bg-accent sm:p-2",
                isToday ? "border-primary" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday && "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground",
                )}
              >
                {cell.day}
              </span>
              {scheduled && (
                <div className="relative w-full flex-1 overflow-hidden rounded-md bg-muted">
                  {thumbnail && (
                    <Image
                      src={thumbnail.imageUrl}
                      alt={scheduled.outfit.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
