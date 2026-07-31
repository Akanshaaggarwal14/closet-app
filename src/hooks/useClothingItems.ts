"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ClothingItem } from "@/types";
import type { ClothingItemInput } from "@/lib/validations/clothing";
import {
  createClothingItem,
  deleteClothingItem,
  toggleFavorite,
  updateClothingItem,
} from "@/app/(app)/closet/actions";

/**
 * Bridges the server-fetched initial list (passed from the /closet server
 * component) with client-side optimistic mutations. Favoriting updates
 * instantly; create/update/delete also trigger a router.refresh() so the
 * server component's data stays the source of truth.
 */
export function useClothingItems(initialItems: ClothingItem[]) {
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  async function addItem(values: ClothingItemInput) {
    const result = await createClothingItem(values);
    if (!result?.error) {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function editItem(id: string, values: ClothingItemInput) {
    const result = await updateClothingItem(id, values);
    if (!result?.error) {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function removeItem(id: string, imagePath: string) {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));
    const result = await deleteClothingItem(id, imagePath);
    if (result?.error) {
      setItems(previous);
    } else {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function toggleItemFavorite(id: string, next: boolean) {
    const previous = items;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isFavorite: next } : item)),
    );
    const result = await toggleFavorite(id, next);
    if (result?.error) {
      setItems(previous);
    }
    return result;
  }

  return { items, addItem, editItem, removeItem, toggleItemFavorite };
}
