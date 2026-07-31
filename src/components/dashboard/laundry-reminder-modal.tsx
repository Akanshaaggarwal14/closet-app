"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { useLaundryReminder } from "@/hooks/useLaundryReminder";
import type { LaundryReminderEntry } from "@/types";

function formatWornDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface LaundryReminderModalProps {
  initialQueue: LaundryReminderEntry[];
}

/**
 * "Yesterday's Outfit" reminder — shown on the Dashboard whenever there's
 * a past planned outfit that hasn't been reviewed for laundry yet. Uses
 * the existing centered Modal (the spec allows a plain modal as an
 * explicit alternative to a bottom sheet on mobile) so it inherits the
 * same touch-target and responsive behavior already verified elsewhere.
 */
export function LaundryReminderModal({ initialQueue }: LaundryReminderModalProps) {
  const { current, isSubmitting, error, toggleItem, isChecked, moveSelected, skip } =
    useLaundryReminder(initialQueue);

  if (!current) return null;

  return (
    <Modal
      open
      onClose={skip}
      variant="center"
      className="max-w-md"
      title="Yesterday's Outfit"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          You wore these items on {formatWornDate(current.date)}. Which ones should be moved to
          Laundry?
        </p>

        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {current.outfit.items.map((item) => {
            const checked = isChecked(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex min-h-11 items-center gap-3 rounded-lg border border-border p-2 text-left transition-colors hover:bg-accent"
              >
                <span
                  className={
                    checked
                      ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
                      : "h-5 w-5 shrink-0 rounded-md border border-input"
                  }
                >
                  {checked && <Check className="h-3.5 w-3.5" />}
                </span>
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <span className="flex-1 truncate text-sm">{item.name}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={skip} disabled={isSubmitting}>
            Skip for Now
          </Button>
          <Button className="flex-1" onClick={moveSelected} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Move Selected to Laundry"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
