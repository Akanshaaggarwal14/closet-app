"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { outfitSchema, type OutfitInput } from "@/lib/validations/outfit";
import type { ClothingItem, Outfit } from "@/types";

interface OutfitBuilderProps {
  open: boolean;
  onClose: () => void;
  editingOutfit: Outfit | null;
  clothingItems: ClothingItem[];
  onCreate: (values: OutfitInput) => Promise<{ error?: string } | undefined>;
  onUpdate: (id: string, values: OutfitInput) => Promise<{ error?: string } | undefined>;
}

export function OutfitBuilder({
  open,
  onClose,
  editingOutfit,
  clothingItems,
  onCreate,
  onUpdate,
}: OutfitBuilderProps) {
  const [search, setSearch] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OutfitInput>({
    resolver: zodResolver(outfitSchema),
    defaultValues: { name: "", clothingItemIds: [] },
  });

  const selectedIds = watch("clothingItemIds") ?? [];

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    setSearch("");
    if (editingOutfit) {
      reset({
        name: editingOutfit.name,
        clothingItemIds: editingOutfit.items.map((item) => item.id),
      });
    } else {
      reset({ name: "", clothingItemIds: [] });
    }
  }, [open, editingOutfit, reset]);

  const filteredClothingItems = clothingItems.filter((item) =>
    item.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const selectedItems = selectedIds
    .map((id) => clothingItems.find((item) => item.id === id))
    .filter((item): item is ClothingItem => !!item);

  function toggleItem(id: string) {
    setValue(
      "clothingItemIds",
      selectedIds.includes(id)
        ? selectedIds.filter((existingId) => existingId !== id)
        : [...selectedIds, id],
      { shouldValidate: true },
    );
  }

  async function onSubmit(values: OutfitInput) {
    setServerError(null);
    const result = editingOutfit
      ? await onUpdate(editingOutfit.id, values)
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
      variant="center"
      className="max-w-4xl"
      title={editingOutfit ? "Edit outfit" : "Create outfit"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="outfit-name">Name</Label>
          <Input id="outfit-name" placeholder="e.g. Weekend brunch" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Your closet</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clothing"
                className="pl-9"
              />
            </div>
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-4">
              {filteredClothingItems.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  No items found.
                </p>
              )}
              {filteredClothingItems.map((item) => {
                const selected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                      selected ? "border-primary" : "border-transparent hover:border-border",
                    )}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    {selected && (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selected ({selectedItems.length})</Label>
            <div className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-2">
              {selectedItems.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Pick items from your closet to build this outfit.
                </p>
              )}
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md bg-secondary/60 p-2"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <span className="flex-1 truncate text-sm">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.clothingItemIds && (
              <p className="text-sm text-destructive">{errors.clothingItemIds.message}</p>
            )}
          </div>
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : editingOutfit ? "Save changes" : "Save outfit"}
        </Button>
      </form>
    </Modal>
  );
}
