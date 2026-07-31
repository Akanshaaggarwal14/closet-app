import { createClient } from "@/lib/supabase/server";
import { mapOutfitRow } from "@/lib/supabase/mappers";
import { CalendarView } from "@/components/calendar/calendar-view";
import type { Outfit, ScheduledOutfit } from "@/types";

const OUTFIT_JOIN = "id, user_id, name, created_at, updated_at, outfit_items(position, clothing_items(*))";

export default async function CalendarPage() {
  const supabase = await createClient();

  const [scheduledResult, outfitsResult] = await Promise.all([
    supabase
      .from("scheduled_outfits")
      .select(`id, user_id, date, created_at, updated_at, outfits(${OUTFIT_JOIN})`)
      .order("date", { ascending: true }),
    supabase
      .from("outfits")
      .select(OUTFIT_JOIN)
      .order("created_at", { ascending: false }),
  ]);

  if (scheduledResult.error) {
    return (
      <div className="p-8 text-sm text-destructive">
        Couldn&apos;t load your calendar: {scheduledResult.error.message}
      </div>
    );
  }

  const allOutfits: Outfit[] = (outfitsResult.data ?? []).map(mapOutfitRow);

  const scheduledOutfits: ScheduledOutfit[] = (scheduledResult.data ?? [])
    .filter((row) => row.outfits)
    .map((row) => ({
      id: row.id,
      userId: row.user_id,
      date: row.date,
      outfit: mapOutfitRow(row.outfits),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

  return <CalendarView initialScheduledOutfits={scheduledOutfits} allOutfits={allOutfits} />;
}
