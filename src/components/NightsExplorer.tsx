"use client";

import { useMemo, useState } from "react";
import type { City, Night, NightFormat } from "@/lib/types";
import { formatLabel } from "@/lib/nights";
import { NightCard } from "./NightCard";
import { CalendarView } from "./CalendarView";

type FormatFilter = NightFormat | "all" | "outdoors";
type ViewMode = "list" | "calendar";

const filters: Array<{ value: FormatFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "dinner", label: "Dinner" },
  { value: "drinks", label: "Drinks" },
  { value: "outdoors", label: "Beach / Picnic" },
  { value: "games", label: "Game night" },
  { value: "brunch", label: "Brunch" },
];

export function NightsExplorer({ nights }: { nights: Night[] }) {
  const [city, setCity] = useState<City | "all">("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [view, setView] = useState<ViewMode>("list");

  const filtered = useMemo(() => {
    let list = nights.filter((n) => (city === "all" ? true : n.city === city));
    if (format === "all") return [...list].sort((a, b) => a.date.localeCompare(b.date));
    if (format === "outdoors") return list.filter((n) => n.format === "beach" || n.format === "picnic");
    return list.filter((n) => n.format === format);
  }, [city, format, nights]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All cities"],
              ["lagos", "Lagos"],
              ["abuja", "Abuja"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCity(value)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition ${
                city === value
                  ? "bg-void text-chalk"
                  : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
              view === "list" ? "bg-void text-chalk" : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
            title="List view"
          >
            📋 List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition ${
              view === "calendar" ? "bg-void text-chalk" : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
            title="Calendar view"
          >
            📅 Calendar
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFormat(f.value)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              format === f.value
                ? "bg-signal text-signal-ink"
                : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {view === "calendar" ? (
        <div className="mt-8">
          <CalendarView nights={filtered} />
        </div>
      ) : (
        <>
          <div className="mt-4 border-t border-line">
            {filtered.map((night) => (
              <NightCard key={night.id} night={night} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-steel">
              No hangouts match these filters. Check back soon — or join the waitlist on a full night.
            </p>
          )}
        </>
      )}
    </div>
  );
}
