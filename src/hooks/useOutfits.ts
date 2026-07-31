"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Outfit } from "@/types";
import type { OutfitInput } from "@/lib/validations/outfit";
import {
  createOutfit,
  deleteOutfit,
  updateOutfit,
} from "@/app/(app)/outfits/actions";

/** Same pattern as useClothingItems — server-fetched list + client mutations. */
export function useOutfits(initialOutfits: Outfit[]) {
  const [outfits, setOutfits] = useState(initialOutfits);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setOutfits(initialOutfits);
  }, [initialOutfits]);

  async function addOutfit(values: OutfitInput) {
    const result = await createOutfit(values);
    if (!result?.error) {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function editOutfit(id: string, values: OutfitInput) {
    const result = await updateOutfit(id, values);
    if (!result?.error) {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function removeOutfit(id: string) {
    const previous = outfits;
    setOutfits((current) => current.filter((outfit) => outfit.id !== id));
    const result = await deleteOutfit(id);
    if (result?.error) {
      setOutfits(previous);
    } else {
      startTransition(() => router.refresh());
    }
    return result;
  }

  return { outfits, addOutfit, editOutfit, removeOutfit };
}
