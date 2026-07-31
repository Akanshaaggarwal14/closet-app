import { z } from "zod";

export const outfitSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  clothingItemIds: z.array(z.string().uuid()).min(1, "Add at least one item"),
});
export type OutfitInput = z.infer<typeof outfitSchema>;
