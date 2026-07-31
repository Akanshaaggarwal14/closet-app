import { create } from "zustand";

interface CalendarStore {
  viewedYear: number;
  viewedMonth: number; // 0-indexed
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;

  selectedDate: string | null; // ISO YYYY-MM-DD, drives the day panel
  openDay: (date: string) => void;
  closeDay: () => void;
}

const today = new Date();

export const useCalendarStore = create<CalendarStore>((set) => ({
  viewedYear: today.getFullYear(),
  viewedMonth: today.getMonth(),

  goToPrevMonth: () =>
    set((state) => {
      const month = state.viewedMonth - 1;
      return month < 0
        ? { viewedYear: state.viewedYear - 1, viewedMonth: 11 }
        : { viewedMonth: month };
    }),

  goToNextMonth: () =>
    set((state) => {
      const month = state.viewedMonth + 1;
      return month > 11
        ? { viewedYear: state.viewedYear + 1, viewedMonth: 0 }
        : { viewedMonth: month };
    }),

  goToToday: () => {
    const now = new Date();
    set({ viewedYear: now.getFullYear(), viewedMonth: now.getMonth() });
  },

  selectedDate: null,
  openDay: (date) => set({ selectedDate: date }),
  closeDay: () => set({ selectedDate: null }),
}));
