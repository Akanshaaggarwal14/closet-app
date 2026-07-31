import Image from "next/image";
import Link from "next/link";
import type { Outfit } from "@/types";

interface TodayOutfitCardProps {
  outfit: Outfit | null;
}

export function TodayOutfitCard({ outfit }: TodayOutfitCardProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Today&apos;s outfit</h3>
      {outfit ? (
        <div className="flex items-center gap-3">
          <div className="grid w-16 shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-md bg-muted">
            {outfit.items.slice(0, 4).map((item) => (
              <div key={item.id} className="relative aspect-square overflow-hidden">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{outfit.name}</p>
            <p className="text-sm text-muted-foreground">
              {outfit.items.length} {outfit.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Nothing planned yet.</p>
          <Link
            href="/calendar"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Plan today&apos;s outfit
          </Link>
        </div>
      )}
    </div>
  );
}
