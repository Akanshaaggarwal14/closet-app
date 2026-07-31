"use client";

import { AnimatePresence } from "motion/react";
import { LaundryItemCard } from "@/components/laundry/laundry-item-card";
import { useLaundryItems } from "@/hooks/useLaundryItems";
import type { ClothingItem } from "@/types";

interface LaundryViewProps {
  initialItems: ClothingItem[];
}

export function LaundryView({ initialItems }: LaundryViewProps) {
  const { items, markWashed } = useLaundryItems(initialItems);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Laundry</h1>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-24 text-center">
          <p className="text-lg font-medium">Nothing in laundry</p>
          <p className="text-sm text-muted-foreground">
            Items you move to laundry from the daily reminder will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <AnimatePresence>
            {items.map((item) => (
              <LaundryItemCard
                key={item.id}
                item={item}
                onMarkWashed={() => markWashed(item.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
