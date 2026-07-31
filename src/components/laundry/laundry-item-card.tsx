"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { ClothingItem } from "@/types";

interface LaundryItemCardProps {
  item: ClothingItem;
  onMarkWashed: () => void;
}

function formatLaundrySince(date: string | null) {
  if (!date) return "recently";
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function LaundryItemCard({ item, onMarkWashed }: LaundryItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="truncate text-sm font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.category} · In laundry since {formatLaundrySince(item.laundrySince)}
          </p>
        </div>
        <Button size="sm" className="w-full" onClick={onMarkWashed}>
          Mark as Washed
        </Button>
      </div>
    </motion.div>
  );
}
