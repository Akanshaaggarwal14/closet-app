/**
 * Shared domain types. Category and Occasion are closed unions per the
 * product spec — do not add values without confirming with the user first.
 */

export const CLOTHING_CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Shoes",
  "Accessories",
] as const;
export type ClothingCategory = (typeof CLOTHING_CATEGORIES)[number];

export const OCCASION_TYPES = [
  "Casual",
  "Outgoing",
  "Formal",
  "Party",
  "Sports",
] as const;
export type OccasionType = (typeof OCCASION_TYPES)[number];

// Stored per clothing item so future AI features can filter/recommend by
// season. Multiple seasons can apply to one item (e.g. a light jacket is
// both Spring and Fall).
export const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;
export type Season = (typeof SEASONS)[number];

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  occasion: OccasionType;
  seasons: Season[];
  imageUrl: string;
  imagePath: string;
  isFavorite: boolean;
  // Laundry Management fields — see supabase/migrations/0006_laundry.sql.
  isInLaundry: boolean;
  lastWorn: string | null;
  lastWashed: string | null;
  wearCount: number;
  laundrySince: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  // Full item objects (via the outfit_items join table), ordered by
  // position. Not a plain array of IDs — deleting a clothing item cascades
  // to remove it from any outfit automatically.
  items: ClothingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledOutfit {
  id: string;
  userId: string;
  date: string; // ISO date (YYYY-MM-DD)
  // Full outfit (with its items) via join, so the calendar can show a
  // thumbnail without a second round trip per day.
  outfit: Outfit;
  // Whether the user has already been asked (and responded) about moving
  // this day's outfit to laundry. See supabase/migrations/0006_laundry.sql.
  laundryProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}

/** One entry in the laundry reminder queue shown on the Dashboard. */
export interface LaundryReminderEntry {
  id: string; // scheduled_outfits.id
  date: string; // ISO date (YYYY-MM-DD) — the day the outfit was worn
  outfit: Outfit;
}

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  avatarPath: string | null;
  email: string;
}
