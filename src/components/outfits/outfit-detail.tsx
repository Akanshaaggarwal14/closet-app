"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Outfit } from "@/types";

interface OutfitDetailProps {
  outfit: Outfit | null;
  onClose: () => void;
  onEdit: (outfit: Outfit) => void;
  onDelete: (outfit: Outfit) => void;
}

export function OutfitDetail({ outfit, onClose, onEdit, onDelete }: OutfitDetailProps) {
  return (
    <Modal open={!!outfit} onClose={onClose} variant="center" className="max-w-xl">
      {outfit && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{outfit.name}</h3>
            <p className="text-sm text-muted-foreground">
              {outfit.items.length} {outfit.items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {outfit.items.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <Badge variant="outline" className="w-full justify-center truncate">
                  {item.name}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onEdit(outfit)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(outfit)}
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
