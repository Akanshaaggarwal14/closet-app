import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(80, "Keep it under 80 characters"),
});
export type ProfileInput = z.infer<typeof profileSchema>;
