"use client";

import { AnimatePresence } from "motion/react";
import { OutfitCard } from "@/components/outfits/outfit-card";
import type { Outfit } from "@/types";

interface OutfitGridProps {
  outfits: Outfit[];
  onSelect: (outfit: Outfit) => void;
}

export function OutfitGrid({ outfits, onSelect }: OutfitGridProps) {
  if (outfits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-24 text-center">
        <p className="text-lg font-medium">No outfits yet</p>
        <p className="text-sm text-muted-foreground">
          Build your first outfit from items in your closet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <AnimatePresence>
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} onClick={() => onSelect(outfit)} />
        ))}
      </AnimatePresence>
    </div>
  );
}
