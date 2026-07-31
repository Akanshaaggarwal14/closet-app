import { createClient } from "@/lib/supabase/server";
import { mapOutfitRow } from "@/lib/supabase/mappers";
import { addDaysToDateKey, todayDateKey } from "@/lib/utils/date";
import { Greeting } from "@/components/dashboard/greeting";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TotalItemsCard } from "@/components/dashboard/total-items-card";
import { TodayOutfitCard } from "@/components/dashboard/today-outfit-card";
import {
  UpcomingOutfitsCard,
  type UpcomingEntry,
} from "@/components/dashboard/upcoming-outfits-card";

const OUTFIT_JOIN = "id, user_id, name, created_at, updated_at, outfit_items(position, clothing_items(*))";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = todayDateKey();
  const upcomingEnd = addDaysToDateKey(today, 6);

  const [profileResult, countResult, todayResult, upcomingResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
    supabase.from("clothing_items").select("id", { count: "exact", head: true }),
    supabase
      .from("scheduled_outfits")
      .select(`id, date, outfits(${OUTFIT_JOIN})`)
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("scheduled_outfits")
      .select(`id, date, outfits(${OUTFIT_JOIN})`)
      .gt("date", today)
      .lte("date", upcomingEnd)
      .order("date", { ascending: true }),
  ]);

  const fullName = profileResult.data?.full_name ?? "";
  const totalItems = countResult.count ?? 0;
  const todayOutfit = todayResult.data?.outfits ? mapOutfitRow(todayResult.data.outfits) : null;

  const upcoming: UpcomingEntry[] = (upcomingResult.data ?? [])
    .filter((row) => row.outfits)
    .map((row) => ({
      date: row.date,
      outfit: mapOutfitRow(row.outfits),
    }));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 sm:p-8">
      <Greeting name={fullName} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <WeatherCard />
        </div>
        <TotalItemsCard count={totalItems} />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TodayOutfitCard outfit={todayOutfit} />
        <UpcomingOutfitsCard items={upcoming} />
      </div>
    </div>
  );
}
