"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { todayDateKey } from "@/lib/utils/date";

function revalidateLaundrySurfaces() {
  revalidatePath("/dashboard");
  revalidatePath("/closet");
  revalidatePath("/outfits");
  revalidatePath("/laundry");
}

/**
 * Applies the user's laundry decision for one past scheduled outfit.
 * Every item in the outfit was actually worn that day, so last_worn /
 * wear_count update for all of them (via the mark_items_worn SQL
 * function, migration 0006) — but only the items the user checked get
 * flagged is_in_laundry. Always marks the scheduled outfit as processed
 * so it's never asked about again, regardless of which items were picked.
 */
export async function processLaundryDecision(
  scheduledOutfitId: string,
  wornDate: string,
  allItemIds: string[],
  laundryItemIds: string[],
) {
  const { supabase, user } = await requireUser();

  const { data: scheduled, error: fetchError } = await supabase
    .from("scheduled_outfits")
    .select("id")
    .eq("id", scheduledOutfitId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !scheduled) {
    return { error: "Couldn't find that scheduled outfit." };
  }

  if (allItemIds.length > 0) {
    const { error: wornError } = await supabase.rpc("mark_items_worn", {
      item_ids: allItemIds,
      worn_date: wornDate,
    });
    if (wornError) {
      return { error: wornError.message };
    }
  }

  if (laundryItemIds.length > 0) {
    const { error: laundryError } = await supabase
      .from("clothing_items")
      .update({ is_in_laundry: true, laundry_since: todayDateKey() })
      .in("id", laundryItemIds)
      .eq("user_id", user.id);

    if (laundryError) {
      return { error: laundryError.message };
    }
  }

  const { error } = await supabase
    .from("scheduled_outfits")
    .update({ laundry_processed: true })
    .eq("id", scheduledOutfitId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateLaundrySurfaces();
  return { success: true };
}

export async function markAsWashed(clothingItemId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("clothing_items")
    .update({
      is_in_laundry: false,
      last_washed: todayDateKey(),
      laundry_since: null,
    })
    .eq("id", clothingItemId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateLaundrySurfaces();
  return { success: true };
}
