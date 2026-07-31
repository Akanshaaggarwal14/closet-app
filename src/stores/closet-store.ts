import { create } from "zustand";
import type { ClothingCategory, ClothingItem } from "@/types";

type CategoryFilter = ClothingCategory | "All";

interface ClosetStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  categoryFilter: CategoryFilter;
  setCategoryFilter: (category: CategoryFilter) => void;

  // Defaults to true ("All Clothes") because season/weather-based
  // filtering is deferred — see Digital Closet feature notes.
  showAllSeasons: boolean;
  setShowAllSeasons: (value: boolean) => void;

  isFormOpen: boolean;
  editingItem: ClothingItem | null;
  openAddForm: () => void;
  openEditForm: (item: ClothingItem) => void;
  closeForm: () => void;

  viewingItem: ClothingItem | null;
  openDetail: (item: ClothingItem) => void;
  closeDetail: () => void;

  deletingItem: ClothingItem | null;
  openDeleteConfirm: (item: ClothingItem) => void;
  closeDeleteConfirm: () => void;
}

export const useClosetStore = create<ClosetStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  categoryFilter: "All",
  setCategoryFilter: (category) => set({ categoryFilter: category }),

  showAllSeasons: true,
  setShowAllSeasons: (value) => set({ showAllSeasons: value }),

  isFormOpen: false,
  editingItem: null,
  openAddForm: () => set({ isFormOpen: true, editingItem: null }),
  openEditForm: (item) => set({ isFormOpen: true, editingItem: item }),
  closeForm: () => set({ isFormOpen: false, editingItem: null }),

  viewingItem: null,
  openDetail: (item) => set({ viewingItem: item }),
  closeDetail: () => set({ viewingItem: null }),

  deletingItem: null,
  openDeleteConfirm: (item) => set({ deletingItem: item }),
  closeDeleteConfirm: () => set({ deletingItem: null }),
}));
