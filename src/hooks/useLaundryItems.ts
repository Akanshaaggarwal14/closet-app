"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ClothingItem } from "@/types";
import { markAsWashed } from "@/app/(app)/laundry/actions";

/**
 * Same server-fetched-list + optimistic-mutation pattern as
 * useClothingItems. Marking an item washed removes it from the local list
 * immediately (its card fade-out animation plays via AnimatePresence in
 * LaundryView), then refreshes so the server list stays the source of
 * truth.
 */
export function useLaundryItems(initialItems: ClothingItem[]) {
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  async function markWashed(id: string) {
    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));
    const result = await markAsWashed(id);
    if (result?.error) {
      setItems(previous);
    } else {
      startTransition(() => router.refresh());
    }
    return result;
  }

  return { items, markWashed };
}
