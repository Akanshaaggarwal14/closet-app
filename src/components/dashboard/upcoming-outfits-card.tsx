import Link from "next/link";
import type { Outfit } from "@/types";

export interface UpcomingEntry {
  date: string;
  outfit: Outfit;
}

interface UpcomingOutfitsCardProps {
  items: UpcomingEntry[];
}

export function UpcomingOutfitsCard({ items }: UpcomingOutfitsCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Upcoming outfits</h3>
      {items.length === 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Nothing planned for the next week.</p>
          <Link
            href="/calendar"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Open calendar
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((entry) => (
            <li key={entry.date} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="truncate pl-3 font-medium">{entry.outfit.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
