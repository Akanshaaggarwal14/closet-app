import { createClient } from "@/lib/supabase/server";
import { mapClothingItemRow, mapOutfitRow } from "@/lib/supabase/mappers";
import { OutfitsView } from "@/components/outfits/outfits-view";
import type { ClothingItem, Outfit } from "@/types";

export default async function OutfitsPage() {
  const supabase = await createClient();

  const [outfitsResult, clothingResult] = await Promise.all([
    supabase
      .from("outfits")
      .select("id, user_id, name, created_at, updated_at, outfit_items(position, clothing_items(*))")
      .order("created_at", { ascending: false }),
    supabase.from("clothing_items").select("*").order("created_at", { ascending: false }),
  ]);

  if (outfitsResult.error) {
    return (
      <div className="p-8 text-sm text-destructive">
        Couldn&apos;t load your outfits: {outfitsResult.error.message}
      </div>
    );
  }

  const clothingItems: ClothingItem[] = (clothingResult.data ?? []).map(mapClothingItemRow);
  const outfits: Outfit[] = (outfitsResult.data ?? []).map(mapOutfitRow);

  return <OutfitsView initialOutfits={outfits} clothingItems={clothingItems} />;
}
