"use client";

import { cn } from "@/lib/utils";

interface PillGroupProps<T extends string> {
  options: readonly T[];
  value: T[];
  onToggle: (option: T) => void;
}

/** Single- or multi-select button group used for category/occasion/season pickers and filters. */
export function PillGroup<T extends string>({ options, value, onToggle }: PillGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={selected}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-foreground hover:bg-accent",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
