"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { OutfitGrid } from "@/components/outfits/outfit-grid";
import { OutfitBuilder } from "@/components/outfits/outfit-builder";
import { OutfitDetail } from "@/components/outfits/outfit-detail";
import { useOutfitsStore } from "@/stores/outfits-store";
import { useOutfits } from "@/hooks/useOutfits";
import type { ClothingItem, Outfit } from "@/types";

interface OutfitsViewProps {
  initialOutfits: Outfit[];
  clothingItems: ClothingItem[];
}

export function OutfitsView({ initialOutfits, clothingItems }: OutfitsViewProps) {
  const { outfits, addOutfit, editOutfit, removeOutfit } = useOutfits(initialOutfits);

  const {
    isBuilderOpen,
    editingOutfit,
    openCreateBuilder,
    openEditBuilder,
    closeBuilder,
    viewingOutfit,
    openDetail,
    closeDetail,
    deletingOutfit,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useOutfitsStore();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Outfit Studio</h1>
          <p className="text-sm text-muted-foreground">
            {outfits.length} {outfits.length === 1 ? "outfit" : "outfits"}
          </p>
        </div>
        <Button onClick={openCreateBuilder}>
          <Plus className="h-4 w-4" />
          Create outfit
        </Button>
      </div>

      <OutfitGrid outfits={outfits} onSelect={openDetail} />

      <OutfitBuilder
        open={isBuilderOpen}
        onClose={closeBuilder}
        editingOutfit={editingOutfit}
        clothingItems={clothingItems}
        onCreate={addOutfit}
        onUpdate={editOutfit}
      />

      <OutfitDetail
        outfit={viewingOutfit}
        onClose={closeDetail}
        onEdit={(outfit) => {
          closeDetail();
          openEditBuilder(outfit);
        }}
        onDelete={(outfit) => {
          closeDetail();
          openDeleteConfirm(outfit);
        }}
      />

      <ConfirmDialog
        open={!!deletingOutfit}
        onClose={closeDeleteConfirm}
        title="Delete this outfit?"
        description={
          deletingOutfit
            ? `"${deletingOutfit.name}" will be permanently removed. This can't be undone.`
            : ""
        }
        onConfirm={() => (deletingOutfit ? removeOutfit(deletingOutfit.id) : Promise.resolve(undefined))}
      />
    </div>
  );
}
