"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClothingItem } from "@/types";

interface ClothingDetailProps {
  item: ClothingItem | null;
  onClose: () => void;
  onEdit: (item: ClothingItem) => void;
  onDelete: (item: ClothingItem) => void;
  onToggleFavorite: (item: ClothingItem) => void;
}

export function ClothingDetail({
  item,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}: ClothingDetailProps) {
  return (
    <Modal open={!!item} onClose={onClose} variant="center" className="max-w-xl">
      {item && (
        <div className="flex flex-col gap-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight">{item.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{item.category}</Badge>
                <Badge variant="outline">{item.occasion}</Badge>
                {item.seasons.map((season) => (
                  <Badge key={season} variant="outline">
                    {season}
                  </Badge>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(item)}
              aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  item.isFavorite ? "fill-destructive text-destructive" : "text-foreground",
                )}
              />
            </button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEdit(item)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
