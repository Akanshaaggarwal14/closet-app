"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClosetFilters } from "@/components/closet/closet-filters";
import { ClothingGrid } from "@/components/closet/clothing-grid";
import { ClothingForm } from "@/components/closet/clothing-form";
import { ClothingDetail } from "@/components/closet/clothing-detail";
import { DeleteConfirm } from "@/components/closet/delete-confirm";
import { useClosetStore } from "@/stores/closet-store";
import { useClothingItems } from "@/hooks/useClothingItems";
import { useWeather } from "@/hooks/useWeather";
import { getApproximateSeason, seasonsForWeather } from "@/lib/utils/season";
import type { ClothingItem } from "@/types";

// Code-split out of the main Closet bundle: this modal (and the
// useWardrobeImport hook it renders) pulls in @imgly/background-removal,
// a sizeable WASM-based library that most page loads never touch. Loading
// it as a separate chunk keeps the initial Closet page bundle lighter.
const ImportWardrobeModal = dynamic(
  () =>
    import("@/components/closet/import/import-wardrobe-modal").then(
      (mod) => mod.ImportWardrobeModal,
    ),
  { ssr: false },
);

interface ClosetViewProps {
  initialItems: ClothingItem[];
}

export function ClosetView({ initialItems }: ClosetViewProps) {
  const router = useRouter();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const { items, addItem, editItem, removeItem, toggleItemFavorite } =
    useClothingItems(initialItems);

  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    showAllSeasons,
    setShowAllSeasons,
    isFormOpen,
    editingItem,
    openAddForm,
    openEditForm,
    closeForm,
    viewingItem,
    openDetail,
    closeDetail,
    deletingItem,
    openDeleteConfirm,
    closeDeleteConfirm,
  } = useClosetStore();

  // Real weather-derived season when available; falls back to the
  // month-based approximation while weather is loading or unavailable
  // (geolocation denied with no manual city set yet).
  const { weather } = useWeather();
  const activeSeasons = weather
    ? seasonsForWeather(weather.season)
    : [getApproximateSeason()];

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      if (query && !item.name.toLowerCase().includes(query)) return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
      if (!showAllSeasons && !item.seasons.some((season) => activeSeasons.includes(season)))
        return false;
      return true;
    });
    // activeSeasons is derived fresh each render from `weather`, so depend
    // on weather directly rather than the recomputed array reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, searchQuery, categoryFilter, showAllSeasons, weather]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Closet</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Sparkles className="h-4 w-4" />
            Import Wardrobe
          </Button>
          <Button onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Add clothing
          </Button>
        </div>
      </div>

      <ClosetFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        showAllSeasons={showAllSeasons}
        onShowAllSeasonsChange={setShowAllSeasons}
        currentSeasonLabel={weather?.season}
      />

      <ClothingGrid
        items={filteredItems}
        onSelect={openDetail}
        onToggleFavorite={(item) => toggleItemFavorite(item.id, !item.isFavorite)}
      />

      <ClothingForm
        open={isFormOpen}
        onClose={closeForm}
        editingItem={editingItem}
        onCreate={addItem}
        onUpdate={editItem}
      />

      <ClothingDetail
        item={viewingItem}
        onClose={closeDetail}
        onEdit={(item) => {
          closeDetail();
          openEditForm(item);
        }}
        onDelete={(item) => {
          closeDetail();
          openDeleteConfirm(item);
        }}
        onToggleFavorite={(item) => toggleItemFavorite(item.id, !item.isFavorite)}
      />

      <DeleteConfirm
        item={deletingItem}
        onClose={closeDeleteConfirm}
        onConfirm={(item) => removeItem(item.id, item.imagePath)}
      />

      <ImportWardrobeModal
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
