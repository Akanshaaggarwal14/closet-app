import { z } from "zod";
import { CLOTHING_CATEGORIES, OCCASION_TYPES, SEASONS } from "@/types";

export const clothingItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  category: z.enum(CLOTHING_CATEGORIES, {
    errorMap: () => ({ message: "Choose a category" }),
  }),
  occasion: z.enum(OCCASION_TYPES, {
    errorMap: () => ({ message: "Choose an occasion" }),
  }),
  seasons: z.array(z.enum(SEASONS)).min(1, "Pick at least one season"),
  imageUrl: z.string().url("Upload an image"),
  imagePath: z.string().min(1),
});
export type ClothingItemInput = z.infer<typeof clothingItemSchema>;
