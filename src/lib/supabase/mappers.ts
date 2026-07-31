import type { ClothingItem, Outfit } from "@/types";

/**
 * Maps a raw clothing_items row (snake_case, as returned by supabase-js)
 * to the app's ClothingItem shape. Shared between the Closet page and
 * anywhere else that reads clothing rows (e.g. the Outfit Studio picker,
 * the Calendar's outfit thumbnails).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw PostgREST row, no generated DB types yet
export function mapClothingItemRow(row: any): ClothingItem {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    occasion: row.occasion,
    seasons: row.seasons ?? [],
    imageUrl: row.image_url,
    imagePath: row.image_path,
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps a raw outfits row that was selected with a nested
 * `outfit_items(position, clothing_items(*))` join to the app's Outfit
 * shape, sorting items by their stored position. Shared between the
 * Outfit Studio page and the Calendar page (which nests this one level
 * deeper under scheduled_outfits).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw PostgREST row, no generated DB types yet
export function mapOutfitRow(row: any): Outfit {
  const joins = (row.outfit_items ?? []) as Array<{
    position: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clothing_items: any;
  }>;

  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    items: joins
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((join) => mapClothingItemRow(join.clothing_items)),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
