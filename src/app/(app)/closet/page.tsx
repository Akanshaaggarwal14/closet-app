import { createClient } from "@/lib/supabase/server";
import { mapClothingItemRow } from "@/lib/supabase/mappers";
import { ClosetView } from "@/components/closet/closet-view";
import type { ClothingItem } from "@/types";

export default async function ClosetPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-sm text-destructive">
        Couldn&apos;t load your closet: {error.message}
      </div>
    );
  }

  const items: ClothingItem[] = (data ?? []).map(mapClothingItemRow);

  return <ClosetView initialItems={items} />;
}
