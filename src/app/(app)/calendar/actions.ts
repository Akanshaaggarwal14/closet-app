"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import {
  scheduledOutfitSchema,
  type ScheduledOutfitInput,
} from "@/lib/validations/scheduled-outfit";

/**
 * Assigns (or re-assigns) the outfit planned for a date. Upsert on the
 * (user_id, date) unique constraint means "assign" and "edit" are the same
 * call — picking a different outfit for an already-planned day just
 * overwrites it.
 */
export async function assignOutfit(values: ScheduledOutfitInput) {
  const parsed = scheduledOutfitSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("scheduled_outfits")
    .upsert(
      {
        user_id: user.id,
        date: parsed.data.date,
        outfit_id: parsed.data.outfitId,
      },
      { onConflict: "user_id,date" },
    );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}

export async function removeScheduledOutfit(id: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("scheduled_outfits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}
