"use client";

import { useMemo, useState } from "react";
import type { City, Night, NightFormat } from "@/lib/types";
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

function ListIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5 4h9M5 8h9M5 12h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2.5" cy="4" r="1" fill="currentColor" />
      <circle cx="2.5" cy="8" r="1" fill="currentColor" />
      <circle cx="2.5" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7h12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

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
            title="List view"
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              view === "list"
                ? "bg-void text-chalk"
                : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
          >
            <ListIcon />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            title="Calendar view"
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
              view === "calendar"
                ? "bg-void text-chalk"
                : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
          >
            <CalendarIcon />
            Calendar
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
