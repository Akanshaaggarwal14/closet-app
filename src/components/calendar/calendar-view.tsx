"use client";

import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { DayPanel } from "@/components/calendar/day-panel";
import { useCalendarStore } from "@/stores/calendar-store";
import { useScheduledOutfits } from "@/hooks/useScheduledOutfits";
import type { Outfit, ScheduledOutfit } from "@/types";

interface CalendarViewProps {
  initialScheduledOutfits: ScheduledOutfit[];
  allOutfits: Outfit[];
}

export function CalendarView({ initialScheduledOutfits, allOutfits }: CalendarViewProps) {
  const { scheduledOutfits, assignForDate, removeForDate } = useScheduledOutfits(
    initialScheduledOutfits,
    allOutfits,
  );

  const {
    viewedYear,
    viewedMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectedDate,
    openDay,
    closeDay,
  } = useCalendarStore();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">Plan which outfit to wear each day.</p>
      </div>

      <CalendarHeader
        year={viewedYear}
        month={viewedMonth}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
      />

      <CalendarGrid
        year={viewedYear}
        month={viewedMonth}
        scheduledOutfits={scheduledOutfits}
        onSelectDate={openDay}
      />

      <DayPanel
        date={selectedDate}
        scheduledOutfits={scheduledOutfits}
        allOutfits={allOutfits}
        onClose={closeDay}
        onAssign={assignForDate}
        onRemove={removeForDate}
      />
    </div>
  );
}
