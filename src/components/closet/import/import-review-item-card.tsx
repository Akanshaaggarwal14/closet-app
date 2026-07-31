"use client";

import { useState } from "react";
import { AlertTriangle, Check, Crop, RotateCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PillGroup } from "@/components/shared/pill-group";
import { ImageCropTool } from "@/components/closet/import/manual-crop";
import { cn } from "@/lib/utils";
import { rotateImageDataUrl } from "@/lib/utils/image";
import { CLOTHING_CATEGORIES, OCCASION_TYPES } from "@/types";
import type { ReviewItem } from "@/hooks/useWardrobeImport";

interface ImportReviewItemCardProps {
  item: ReviewItem;
  onToggleSelected: () => void;
  onRemove: () => void;
  onUpdate: (
    updates: Partial<Pick<ReviewItem, "name" | "category" | "occasion" | "imageDataUrl">>,
  ) => void;
}

export function ImportReviewItemCard({
  item,
  onToggleSelected,
  onRemove,
  onUpdate,
}: ImportReviewItemCardProps) {
  const [isCropping, setIsCropping] = useState(false);
  const [rotating, setRotating] = useState(false);

  async function handleRotate() {
    setRotating(true);
    try {
      const rotated = await rotateImageDataUrl(item.imageDataUrl, 90);
      onUpdate({ imageDataUrl: rotated });
    } catch {
      // Non-critical — the user can just try again or leave it as-is.
    } finally {
      setRotating(false);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 transition-colors",
        item.selected ? "border-primary bg-card" : "border-border bg-muted/40 opacity-60",
      )}
    >
      {isCropping ? (
        <ImageCropTool
          imageSrc={item.imageDataUrl}
          onCancel={() => setIsCropping(false)}
          onCropped={(dataUrl) => {
            onUpdate({ imageDataUrl: dataUrl });
            setIsCropping(false);
          }}
        />
      ) : (
        <div className="flex gap-3">
          <div className="relative h-24 w-24 shrink-0">
            <button
              type="button"
              onClick={onToggleSelected}
              className="h-full w-full overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]"
              aria-label={item.selected ? "Deselect item" : "Select item"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URL preview; next/image can't handle non-http sources */}
              <img
                src={item.imageDataUrl}
                alt={item.name}
                className="h-full w-full object-contain"
              />
              {item.selected && (
                <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <Input
              value={item.name}
              onChange={(event) => onUpdate({ name: event.target.value })}
              className="h-8 text-sm"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleRotate}
                disabled={rotating}
                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                <RotateCw className="h-3 w-3" />
                Rotate
              </button>
              <button
                type="button"
                onClick={() => setIsCropping(true)}
                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                <Crop className="h-3 w-3" />
                Crop
              </button>
            </div>
            {!item.backgroundRemoved && (
              <p className="flex items-center gap-1 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                Background removal failed — using the original photo.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label="Discard this item"
            className="h-8 w-8 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {!isCropping && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <PillGroup
              options={CLOTHING_CATEGORIES}
              value={[item.category]}
              onToggle={(value) => onUpdate({ category: value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Occasion</Label>
            <PillGroup
              options={OCCASION_TYPES}
              value={[item.occasion]}
              onToggle={(value) => onUpdate({ occasion: value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
