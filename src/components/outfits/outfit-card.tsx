"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Outfit } from "@/types";

interface OutfitCardProps {
  outfit: Outfit;
  onClick: () => void;
}

export function OutfitCard({ outfit, onClick }: OutfitCardProps) {
  const previewItems = outfit.items.slice(0, 4);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden bg-muted">
        {previewItems.length > 0 ? (
          previewItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative overflow-hidden",
                previewItems.length === 1 && "col-span-2 row-span-2",
              )}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 row-span-2 flex items-center justify-center text-xs text-muted-foreground">
            No items yet
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium">{outfit.name}</p>
        <p className="text-xs text-muted-foreground">
          {outfit.items.length} {outfit.items.length === 1 ? "item" : "items"}
        </p>
      </div>
    </motion.button>
  );
}
