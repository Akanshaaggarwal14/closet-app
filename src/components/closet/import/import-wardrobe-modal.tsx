"use client";

import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { ImportDropzone } from "@/components/closet/import/import-dropzone";
import { ImportProcessing } from "@/components/closet/import/import-processing";
import { ImportReviewGrid } from "@/components/closet/import/import-review-grid";
import { useWardrobeImport } from "@/hooks/useWardrobeImport";

interface ImportWardrobeModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Version 1 import flow: upload one or more photos -> each becomes its own
 * wardrobe item with its background removed automatically (entirely
 * client-side) -> review/edit each one -> save. No AI clothing detection —
 * one photo always maps to exactly one item.
 */
export function ImportWardrobeModal({ open, onClose, onSaved }: ImportWardrobeModalProps) {
  const {
    status,
    items,
    error,
    progress,
    processFiles,
    toggleSelected,
    removeItem,
    updateItem,
    saveSelected,
    reset,
  } = useWardrobeImport();

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSave() {
    await saveSelected();
    onSaved();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      variant="center"
      className="max-w-3xl"
      title="Import Wardrobe"
    >
      <div className="flex flex-col gap-5">
        {status === "idle" && (
          <>
            <ImportDropzone multiple onFilesSelected={processFiles} />
            <p className="text-xs text-muted-foreground">
              Each photo becomes one wardrobe item — its background is removed
              automatically, right in your browser. You can rename, re-categorize, rotate,
              or crop before saving.
            </p>
          </>
        )}

        {status === "processing" && (
          <ImportProcessing current={progress.current} total={progress.total} />
        )}

        {(status === "review" || status === "saving") && (
          <ImportReviewGrid
            items={items}
            saving={status === "saving"}
            onToggleSelected={toggleSelected}
            onRemove={removeItem}
            onUpdate={updateItem}
            onSave={handleSave}
            onCancel={handleClose}
          />
        )}

        {status === "done" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="font-medium">Added to your closet.</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleClose}>Done</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
