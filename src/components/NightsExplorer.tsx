"use client";

import { useMemo, useState } from "react";
import type { City, Night } from "@/lib/types";
import { NightCard } from "./NightCard";

export function NightsExplorer({ nights }: { nights: Night[] }) {
  const [city, setCity] = useState<City | "all">("all");

  const filtered = useMemo(() => {
    if (city === "all") return nights;
    return nights.filter((n) => n.city === city);
  }, [city, nights]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "All"],
            ["lagos", "Lagos"],
            ["abuja", "Abuja"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setCity(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              city === value
                ? "bg-void text-chalk"
                : "border border-line bg-chalk-hot text-void-soft hover:border-void/25"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-line">
        {filtered.map((night) => (
          <NightCard key={night.id} night={night} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-steel">
          No nights in this city yet. Request an invite and we’ll ping you.
        </p>
      )}
    </div>
  );
}
