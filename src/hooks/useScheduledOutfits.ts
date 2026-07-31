"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Outfit, ScheduledOutfit } from "@/types";
import { assignOutfit, removeScheduledOutfit } from "@/app/(app)/calendar/actions";

/**
 * Same server-fetched-list + client-mutation pattern as useClothingItems /
 * useOutfits. `allOutfits` is passed in so an optimistic ScheduledOutfit
 * entry can be built immediately (with the outfit's photos) rather than
 * waiting on a round trip.
 */
export function useScheduledOutfits(
  initialScheduledOutfits: ScheduledOutfit[],
  allOutfits: Outfit[],
) {
  const [scheduledOutfits, setScheduledOutfits] = useState(initialScheduledOutfits);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setScheduledOutfits(initialScheduledOutfits);
  }, [initialScheduledOutfits]);

  async function assignForDate(date: string, outfitId: string) {
    const outfit = allOutfits.find((o) => o.id === outfitId);
    const previous = scheduledOutfits;

    if (outfit) {
      setScheduledOutfits((current) => {
        const withoutDate = current.filter((entry) => entry.date !== date);
        const existing = current.find((entry) => entry.date === date);
        return [
          ...withoutDate,
          {
            id: existing?.id ?? `optimistic-${date}`,
            userId: outfit.userId,
            date,
            outfit,
            createdAt: existing?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
      });
    }

    const result = await assignOutfit({ date, outfitId });
    if (result?.error) {
      setScheduledOutfits(previous);
    } else {
      startTransition(() => router.refresh());
    }
    return result;
  }

  async function removeForDate(id: string) {
    const previous = scheduledOutfits;
    setScheduledOutfits((current) => current.filter((entry) => entry.id !== id));
    const result = await removeScheduledOutfit(id);
    if (result?.error) {
      setScheduledOutfits(previous);
    } else {
      startTransition(() => router.refresh());
    }
    return result;
  }

  return { scheduledOutfits, assignForDate, removeForDate };
}
