import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes conditionally, resolving conflicting utility
 * classes (e.g. "p-2" vs "p-4") in favor of the last one applied.
 * Used by every shadcn/ui component and safe to use anywhere else
 * that needs conditional className composition.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
