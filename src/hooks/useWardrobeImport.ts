"use client";

import { useState } from "react";
import { createClothingItem } from "@/app/(app)/closet/actions";
import { createClient } from "@/lib/supabase/client";
import { removeImageBackground } from "@/services/wardrobe-import/backgroundRemovalService";
import { blobToDataUrl } from "@/lib/utils/image";
import type { ClothingCategory, OccasionType } from "@/types";

export interface ReviewItem {
  id: string;
  imageDataUrl: string;
  /** false if background removal failed and we fell back to the original photo. */
  backgroundRemoved: boolean;
  name: string;
  category: ClothingCategory;
  occasion: OccasionType;
  selected: boolean;
}

export type ImportStatus = "idle" | "processing" | "review" | "saving" | "done";

let itemCounter = 0;

/**
 * Version 1 import: one uploaded photo = one wardrobe item. Each file gets
 * its background removed locally in the browser (no server, no AI
 * detection), then shows up as an editable review card. Saving reuses the
 * same createClothingItem action the manual Add Clothing form uses.
 */
export function useWardrobeImport() {
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  async function processFiles(files: File[]) {
    setStatus("processing");
    setError(null);
    setItems([]);
    setProgress({ current: 0, total: files.length });

    const results: ReviewItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      itemCounter += 1;

      let imageDataUrl: string;
      let backgroundRemoved = true;

      try {
        const cutout = await removeImageBackground(file);
        imageDataUrl = await blobToDataUrl(cutout);
      } catch {
        // Background removal failed — fall back to the original photo
        // rather than blocking the import; the review card flags this so
        // the user can decide whether to keep or discard the item.
        backgroundRemoved = false;
        imageDataUrl = await blobToDataUrl(file);
      }

      results.push({
        id: crypto.randomUUID(),
        imageDataUrl,
        backgroundRemoved,
        name: `Item ${itemCounter}`,
        category: "Tops",
        occasion: "Casual",
        selected: true,
      });

      setProgress({ current: i + 1, total: files.length });
    }

    setItems(results);
    setStatus("review");
  }

  function toggleSelected(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateItem(
    id: string,
    updates: Partial<Pick<ReviewItem, "name" | "category" | "occasion" | "imageDataUrl">>,
  ) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  async function saveSelected() {
    setStatus("saving");
    setError(null);

    const toSave = items.filter((item) => item.selected);
    const supabase = createClient();
    let saveError: string | null = null;

    for (const item of toSave) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const blob = await (await fetch(item.imageDataUrl)).blob();
        const storagePath = `${user.id}/${crypto.randomUUID()}.png`;

        const { error: uploadError } = await supabase.storage
          .from("clothing-images")
          .upload(storagePath, blob, { contentType: "image/png" });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("clothing-images").getPublicUrl(storagePath);

        const result = await createClothingItem({
          name: item.name,
          category: item.category,
          occasion: item.occasion,
          // Season isn't collected in the import flow — default to all,
          // matching the same "all-season until edited" convention used
          // elsewhere. Editable afterward from the Closet.
          seasons: ["Spring", "Summer", "Fall", "Winter"],
          imageUrl: publicUrl,
          imagePath: storagePath,
        });

        if (result?.error) throw new Error(result.error);
      } catch (err) {
        saveError = err instanceof Error ? err.message : "Couldn't save one of the items";
      }
    }

    setError(saveError);
    setStatus("done");
  }

  function reset() {
    setStatus("idle");
    setItems([]);
    setError(null);
    setProgress({ current: 0, total: 0 });
  }

  return {
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
  };
}
