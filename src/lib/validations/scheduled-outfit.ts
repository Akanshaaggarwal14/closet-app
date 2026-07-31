import { z } from "zod";

export const scheduledOutfitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  outfitId: z.string().uuid(),
});
export type ScheduledOutfitInput = z.infer<typeof scheduledOutfitSchema>;
