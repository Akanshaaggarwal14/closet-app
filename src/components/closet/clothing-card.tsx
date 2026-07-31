"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClothingItem } from "@/types";

interface ClothingCardProps {
  item: ClothingItem;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function ClothingCard({ item, onClick, onToggleFavorite }: ClothingCardProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: item.isInLaundry ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.isInLaundry && (
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur-sm">
            In Laundry
          </Badge>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-transform active:scale-90"
        >
          <motion.span
            initial={false}
            animate={{ scale: item.isFavorite ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                item.isFavorite ? "fill-destructive text-destructive" : "text-foreground",
              )}
            />
          </motion.span>
        </button>
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{item.category}</Badge>
          <Badge variant="outline">{item.occasion}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
