import { createClient } from "@/lib/supabase/server";
import { mapClothingItemRow } from "@/lib/supabase/mappers";
import { LaundryView } from "@/components/laundry/laundry-view";
import type { ClothingItem } from "@/types";

export default async function LaundryPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("is_in_laundry", true)
    .order("laundry_since", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-sm text-destructive">
        Couldn&apos;t load your laundry: {error.message}
      </div>
    );
  }

  const items: ClothingItem[] = (data ?? []).map(mapClothingItemRow);

  return <LaundryView initialItems={items} />;
}
