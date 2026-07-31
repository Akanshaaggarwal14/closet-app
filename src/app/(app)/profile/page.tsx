import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/profile/profile-view";
import type { Profile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, avatar_path")
    .eq("id", user!.id)
    .single();

  if (error || !data) {
    return (
      <div className="p-8 text-sm text-destructive">
        Couldn&apos;t load your profile{error ? `: ${error.message}` : ""}.
      </div>
    );
  }

  const profile: Profile = {
    id: data.id,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    avatarPath: data.avatar_path,
    email: user!.email ?? "",
  };

  return <ProfileView profile={profile} />;
}
