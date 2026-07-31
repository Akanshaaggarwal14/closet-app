"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";

export async function updateProfile(values: ProfileInput) {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard"); // greeting also reads full_name
  return { success: true };
}

export async function updateAvatar(
  avatarUrl: string,
  avatarPath: string,
  previousPath: string | null,
) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, avatar_path: avatarPath })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  if (previousPath) {
    // Best-effort cleanup of the old photo — not worth failing the update over.
    await supabase.storage.from("avatars").remove([previousPath]);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
