"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processLaundryDecision } from "@/app/(app)/laundry/actions";
import type { LaundryReminderEntry } from "@/types";

/**
 * Drives the "Yesterday's Outfit" reminder queue on the Dashboard. The
 * queue (oldest-unprocessed-first) comes from the server; items are
 * pre-checked by default since the spec's example shows every worn item
 * checked, with the user unchecking anything they don't want laundered.
 *
 * Skipping dismisses the whole queue for this page load — nothing is
 * written to the DB, so a fresh app open (fresh server fetch) will ask
 * again starting from the same oldest unprocessed date. Moving selected
 * items to laundry advances to the next queued date in the same sitting.
 */
export function useLaundryReminder(initialQueue: LaundryReminderEntry[]) {
  const router = useRouter();
  const [queue, setQueue] = useState(initialQueue);
  const [dismissed, setDismissed] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialQueue[0]?.outfit.items.map((item) => item.id) ?? []),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = dismissed ? null : (queue[0] ?? null);

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isChecked(id: string) {
    return selected.has(id);
  }

  function skip() {
    setDismissed(true);
  }

  async function moveSelected() {
    if (!current) return;
    setIsSubmitting(true);
    setError(null);

    const result = await processLaundryDecision(
      current.id,
      current.date,
      current.outfit.items.map((item) => item.id),
      Array.from(selected),
    );

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    const rest = queue.slice(1);
    setQueue(rest);
    setSelected(new Set(rest[0]?.outfit.items.map((item) => item.id) ?? []));
    router.refresh();
  }

  return { current, isSubmitting, error, toggleItem, isChecked, moveSelected, skip };
}
