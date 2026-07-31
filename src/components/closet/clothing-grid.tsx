"use client";

import { AnimatePresence } from "motion/react";
import { ClothingCard } from "@/components/closet/clothing-card";
import type { ClothingItem } from "@/types";

interface ClothingGridProps {
  items: ClothingItem[];
  onSelect: (item: ClothingItem) => void;
  onToggleFavorite: (item: ClothingItem) => void;
}

export function ClothingGrid({ items, onSelect, onToggleFavorite }: ClothingGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-24 text-center">
        <p className="text-lg font-medium">No clothes here yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first item to start building your digital closet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <AnimatePresence>
        {items.map((item) => (
          <ClothingCard
            key={item.id}
            item={item}
            onClick={() => onSelect(item)}
            onToggleFavorite={() => onToggleFavorite(item)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
