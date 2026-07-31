import { create } from "zustand";
import type { Outfit } from "@/types";

interface OutfitsStore {
  isBuilderOpen: boolean;
  editingOutfit: Outfit | null;
  openCreateBuilder: () => void;
  openEditBuilder: (outfit: Outfit) => void;
  closeBuilder: () => void;

  viewingOutfit: Outfit | null;
  openDetail: (outfit: Outfit) => void;
  closeDetail: () => void;

  deletingOutfit: Outfit | null;
  openDeleteConfirm: (outfit: Outfit) => void;
  closeDeleteConfirm: () => void;
}

export const useOutfitsStore = create<OutfitsStore>((set) => ({
  isBuilderOpen: false,
  editingOutfit: null,
  openCreateBuilder: () => set({ isBuilderOpen: true, editingOutfit: null }),
  openEditBuilder: (outfit) => set({ isBuilderOpen: true, editingOutfit: outfit }),
  closeBuilder: () => set({ isBuilderOpen: false, editingOutfit: null }),

  viewingOutfit: null,
  openDetail: (outfit) => set({ viewingOutfit: outfit }),
  closeDetail: () => set({ viewingOutfit: null }),

  deletingOutfit: null,
  openDeleteConfirm: (outfit) => set({ deletingOutfit: outfit }),
  closeDeleteConfirm: () => set({ deletingOutfit: null }),
}));
