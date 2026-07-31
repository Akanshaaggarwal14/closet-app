"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import type { ClothingItem } from "@/types";

interface DeleteConfirmProps {
  item: ClothingItem | null;
  onClose: () => void;
  onConfirm: (item: ClothingItem) => Promise<{ error?: string } | undefined>;
}

export function DeleteConfirm({ item, onClose, onConfirm }: DeleteConfirmProps) {
  return (
    <ConfirmDialog
      open={!!item}
      onClose={onClose}
      title="Delete this item?"
      description={
        item
          ? `"${item.name}" will be permanently removed from your closet. This can't be undone.`
          : ""
      }
      onConfirm={() => (item ? onConfirm(item) : Promise.resolve(undefined))}
    />
  );
}
