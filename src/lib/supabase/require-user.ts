import { createClient } from "@/lib/supabase/server";

/**
 * Shared guard for server actions — gets the current session's user or
 * throws. Used by every mutation across features (closet, outfits, etc.)
 * so auth-checking logic lives in exactly one place.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return { supabase, user };
}
