"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { PillGroup } from "@/components/shared/pill-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  clothingItemSchema,
  type ClothingItemInput,
} from "@/lib/validations/clothing";
import {
  CLOTHING_CATEGORIES,
  OCCASION_TYPES,
  SEASONS,
  type ClothingItem,
} from "@/types";

type FormValues = ClothingItemInput;

interface ClothingFormProps {
  open: boolean;
  onClose: () => void;
  editingItem: ClothingItem | null;
  onCreate: (values: ClothingItemInput) => Promise<{ error?: string } | undefined>;
  onUpdate: (
    id: string,
    values: ClothingItemInput,
  ) => Promise<{ error?: string } | undefined>;
}

export function ClothingForm({
  open,
  onClose,
  editingItem,
  onCreate,
  onUpdate,
}: ClothingFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(clothingItemSchema),
    defaultValues: {
      name: "",
      category: undefined,
      occasion: undefined,
      seasons: [],
      imageUrl: "",
      imagePath: "",
    },
  });

  const category = watch("category");
  const occasion = watch("occasion");
  const seasons = watch("seasons") ?? [];
  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    if (editingItem) {
      reset({
        name: editingItem.name,
        category: editingItem.category,
        occasion: editingItem.occasion,
        seasons: editingItem.seasons,
        imageUrl: editingItem.imageUrl,
        imagePath: editingItem.imagePath,
      });
      setPreview(editingItem.imageUrl);
    } else {
      reset({
        name: "",
        category: undefined,
        occasion: undefined,
        seasons: [],
        imageUrl: "",
        imagePath: "",
      });
      setPreview(null);
    }
  }, [open, editingItem, reset]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("clothing-images")
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("clothing-images").getPublicUrl(path);

      setValue("imageUrl", publicUrl, { shouldValidate: true });
      setValue("imagePath", path, { shouldValidate: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = editingItem
      ? await onUpdate(editingItem.id, values)
      : await onCreate(values);

    if (result?.error) {
      setServerError(result.error);
      return;
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      variant="drawer"
      title={editingItem ? "Edit item" : "Add clothing"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="space-y-2">
          <Label>Photo</Label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex aspect-[3/4] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local
              // blob preview URL; next/image can't optimize non-http sources.
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">Upload image</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs">
                Uploading…
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {errors.imageUrl && !imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="e.g. White linen shirt" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <PillGroup
            options={CLOTHING_CATEGORIES}
            value={category ? [category] : []}
            onToggle={(value) => setValue("category", value, { shouldValidate: true })}
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Occasion</Label>
          <PillGroup
            options={OCCASION_TYPES}
            value={occasion ? [occasion] : []}
            onToggle={(value) => setValue("occasion", value, { shouldValidate: true })}
          />
          {errors.occasion && (
            <p className="text-sm text-destructive">{errors.occasion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Seasons</Label>
          <PillGroup
            options={SEASONS}
            value={seasons}
            onToggle={(value) =>
              setValue(
                "seasons",
                seasons.includes(value)
                  ? seasons.filter((s) => s !== value)
                  : [...seasons, value],
                { shouldValidate: true },
              )
            }
          />
          {errors.seasons && (
            <p className="text-sm text-destructive">{errors.seasons.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
          {isSubmitting ? "Saving…" : editingItem ? "Save changes" : "Add to closet"}
        </Button>
      </form>
    </Modal>
  );
}
