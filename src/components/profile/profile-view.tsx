"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { updateAvatar, updateProfile } from "@/app/(app)/profile/actions";
import { profileSchema } from "@/lib/validations/profile";
import type { Profile } from "@/types";

interface ProfileViewProps {
  profile: Profile;
}

export function ProfileView({ profile }: ProfileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [avatarPath, setAvatarPath] = useState(profile.avatarPath);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(profile.fullName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAvatarError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${profile.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const result = await updateAvatar(publicUrl, path, avatarPath);
      if (result?.error) throw new Error(result.error);

      setAvatarUrl(publicUrl);
      setAvatarPath(path);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Couldn't update photo");
    } finally {
      setUploading(false);
    }
  }

  async function handleNameSubmit(event: FormEvent) {
    event.preventDefault();
    setNameError(null);
    setSaved(false);

    const parsed = profileSchema.safeParse({ fullName });
    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message ?? "Invalid name");
      return;
    }

    setSaving(true);
    const result = await updateProfile(parsed.data);
    setSaving(false);

    if (result?.error) {
      setNameError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative h-24 w-24 overflow-hidden rounded-full border border-border bg-muted"
        >
          {avatarUrl ? (
            <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
              {fullName.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-5 w-5 text-white" />
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs">
              Uploading…
            </div>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        {avatarError && <p className="text-sm text-destructive">{avatarError}</p>}
      </div>

      <form onSubmit={handleNameSubmit} className="space-y-2">
        <Label htmlFor="fullName">Name</Label>
        <div className="flex gap-2">
          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              setSaved(false);
            }}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
        {nameError && <p className="text-sm text-destructive">{nameError}</p>}
        {saved && <p className="text-sm text-muted-foreground">Saved.</p>}
      </form>
    </div>
  );
}
