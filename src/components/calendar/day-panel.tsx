"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import type { Outfit, ScheduledOutfit } from "@/types";

interface DayPanelProps {
  date: string | null;
  scheduledOutfits: ScheduledOutfit[];
  allOutfits: Outfit[];
  onClose: () => void;
  onAssign: (date: string, outfitId: string) => Promise<{ error?: string } | undefined>;
  onRemove: (id: string) => Promise<{ error?: string } | undefined>;
}

function formatDisplayDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function DayPanel({
  date,
  scheduledOutfits,
  allOutfits,
  onClose,
  onAssign,
  onRemove,
}: DayPanelProps) {
  const existing = date ? scheduledOutfits.find((entry) => entry.date === date) : undefined;
  const [mode, setMode] = useState<"view" | "pick">(existing ? "view" : "pick");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!date) return;
    setMode(existing ? "view" : "pick");
    setError(null);
    // Only re-run when the selected date changes, not on every list update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  async function handleAssign(outfitId: string) {
    if (!date) return;
    setIsSubmitting(true);
    setError(null);
    const result = await onAssign(date, outfitId);
    setIsSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setMode("view");
  }

  async function handleRemove() {
    if (!existing) return;
    setIsSubmitting(true);
    setError(null);
    const result = await onRemove(existing.id);
    setIsSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={!!date}
      onClose={onClose}
      variant="center"
      className="max-w-lg"
      title={date ? formatDisplayDate(date) : undefined}
    >
      {date && (
        <div className="space-y-4">
          {mode === "view" && existing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="grid w-16 shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-md bg-muted">
                  {existing.outfit.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative aspect-square overflow-hidden">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{existing.outfit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {existing.outfit.items.length}{" "}
                    {existing.outfit.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setMode("pick")}
                  disabled={isSubmitting}
                >
                  <Pencil className="h-4 w-4" />
                  Change outfit
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleRemove}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Pick a saved outfit to plan for this day.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {allOutfits.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                  You don&apos;t have any saved outfits yet — build one in Outfit Studio first.
                </p>
              ) : (
                <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
                  {allOutfits.map((outfit) => (
                    <button
                      key={outfit.id}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAssign(outfit.id)}
                      className="flex flex-col overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-primary disabled:opacity-50"
                    >
                      <div className="grid aspect-square w-full grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden bg-muted">
                        {outfit.items.slice(0, 4).map((item) => (
                          <div key={item.id} className="relative overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="truncate p-1.5 text-xs font-medium">{outfit.name}</p>
                    </button>
                  ))}
                </div>
              )}
              {existing && (
                <Button variant="ghost" className="w-full" onClick={() => setMode("view")}>
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
