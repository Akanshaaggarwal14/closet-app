"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { outfitSchema, type OutfitInput } from "@/lib/validations/outfit";

function toOutfitItemRows(outfitId: string, clothingItemIds: string[]) {
  return clothingItemIds.map((clothingItemId, index) => ({
    outfit_id: outfitId,
    clothing_item_id: clothingItemId,
    position: index,
  }));
}

export async function createOutfit(values: OutfitInput) {
  const parsed = outfitSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .insert({ user_id: user.id, name: parsed.data.name })
    .select("id")
    .single();

  if (outfitError || !outfit) {
    return { error: outfitError?.message ?? "Couldn't create outfit" };
  }

  const { error: itemsError } = await supabase
    .from("outfit_items")
    .insert(toOutfitItemRows(outfit.id, parsed.data.clothingItemIds));

  if (itemsError) {
    // Compensate: don't leave an empty outfit behind if attaching items failed.
    await supabase.from("outfits").delete().eq("id", outfit.id);
    return { error: itemsError.message };
  }

  revalidatePath("/outfits");
  return { success: true };
}

export async function updateOutfit(id: string, values: OutfitInput) {
  const parsed = outfitSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { error: outfitError } = await supabase
    .from("outfits")
    .update({ name: parsed.data.name })
    .eq("id", id)
    .eq("user_id", user.id);

  if (outfitError) {
    return { error: outfitError.message };
  }

  const { error: deleteError } = await supabase
    .from("outfit_items")
    .delete()
    .eq("outfit_id", id);

  if (deleteError) {
    return { error: deleteError.message };
  }

  const { error: insertError } = await supabase
    .from("outfit_items")
    .insert(toOutfitItemRows(id, parsed.data.clothingItemIds));

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath("/outfits");
  return { success: true };
}

export async function deleteOutfit(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("outfits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/outfits");
  return { success: true };
}
