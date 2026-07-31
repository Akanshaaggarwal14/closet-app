"use client";

import { Button } from "@/components/ui/button";
import { ImportReviewItemCard } from "@/components/closet/import/import-review-item-card";
import type { ReviewItem } from "@/hooks/useWardrobeImport";

interface ImportReviewGridProps {
  items: ReviewItem[];
  saving: boolean;
  onToggleSelected: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    updates: Partial<Pick<ReviewItem, "name" | "category" | "occasion" | "imageDataUrl">>,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ImportReviewGrid({
  items,
  saving,
  onToggleSelected,
  onRemove,
  onUpdate,
  onSave,
  onCancel,
}: ImportReviewGridProps) {
  const selectedCount = items.filter((item) => item.selected).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Found {items.length} {items.length === 1 ? "item" : "items"}. Review, edit, and pick which
        ones to add.
      </p>

      <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
        {items.map((item) => (
          <ImportReviewItemCard
            key={item.id}
            item={item}
            onToggleSelected={() => onToggleSelected(item.id)}
            onRemove={() => onRemove(item.id)}
            onUpdate={(updates) => onUpdate(item.id, updates)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onSave} disabled={saving || selectedCount === 0}>
          {saving ? "Saving…" : `Add ${selectedCount} ${selectedCount === 1 ? "item" : "items"}`}
        </Button>
      </div>
    </div>
  );
}
