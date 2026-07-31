"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { clothingItemSchema, type ClothingItemInput } from "@/lib/validations/clothing";

export async function createClothingItem(values: ClothingItemInput) {
  const parsed = clothingItemSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("clothing_items").insert({
    user_id: user.id,
    name: parsed.data.name,
    category: parsed.data.category,
    occasion: parsed.data.occasion,
    seasons: parsed.data.seasons,
    image_url: parsed.data.imageUrl,
    image_path: parsed.data.imagePath,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/closet");
  return { success: true };
}

export async function updateClothingItem(id: string, values: ClothingItemInput) {
  const parsed = clothingItemSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("clothing_items")
    .update({
      name: parsed.data.name,
      category: parsed.data.category,
      occasion: parsed.data.occasion,
      seasons: parsed.data.seasons,
      image_url: parsed.data.imageUrl,
      image_path: parsed.data.imagePath,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/closet");
  return { success: true };
}

export async function deleteClothingItem(id: string, imagePath: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("clothing_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  // Best-effort cleanup — if this fails the row is already gone, which
  // matters more than an orphaned file in storage.
  await supabase.storage.from("clothing-images").remove([imagePath]);

  revalidatePath("/closet");
  return { success: true };
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("clothing_items")
    .update({ is_favorite: isFavorite })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/closet");
  return { success: true };
}
