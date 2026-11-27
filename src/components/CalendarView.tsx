"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Night } from "@/lib/types";
import { formatNaira, formatLabel, cityLabel, seatsLeft } from "@/lib/nights";

type CalendarDay = {
  date: string;
  nights: Night[];
  isCurrentMonth: boolean;
};

export function CalendarView({ nights }: { nights: Night[] }) {
  const calendar = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const isCurrentMonth = current.getMonth() === currentMonth;
      const dayNights = nights.filter((n) => n.date === dateStr);

      days.push({
        date: dateStr,
        nights: dayNights,
        isCurrentMonth,
      });

      current.setDate(current.getDate() + 1);
    }

    return {
      monthName: firstDay.toLocaleDateString("en-NG", { month: "long", year: "numeric" }),
      days,
    };
  }, [nights]);

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-bold">{calendar.monthName}</h2>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-xs font-semibold uppercase tracking-wider text-steel">
            {day}
          </div>
        ))}

        {calendar.days.map((day) => {
          const dayNum = new Date(day.date).getDate();
          const isPast = new Date(day.date) < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={day.date}
              className={`min-h-24 rounded-lg border p-2 transition ${
                day.isCurrentMonth
                  ? isPast
                    ? "border-line/50 bg-fog/50"
                    : "border-line bg-white hover:border-signal/30"
                  : "border-line/30 bg-fog/30"
              } ${day.nights.length > 0 ? "cursor-pointer" : ""}`}
            >
              <div className={`mb-1 text-sm font-semibold ${day.isCurrentMonth ? "text-void" : "text-steel/50"}`}>
                {dayNum}
              </div>

              {day.nights.length > 0 && (
                <div className="space-y-1">
                  {day.nights.map((night) => {
                    const left = seatsLeft(night);
                    const isFull = left === 0 || night.status === "full";

                    return (
                      <Link
                        key={night.id}
                        href={`/nights/${night.id}`}
                        className={`block rounded px-1.5 py-1 text-xs transition ${
                          isFull
                            ? "bg-steel/10 text-steel line-through"
                            : night.status === "flash"
                              ? "bg-signal text-signal-ink hover:bg-signal/90"
                              : night.city === "lagos"
                                ? "bg-void/90 text-chalk hover:bg-void"
                                : "bg-clay/90 text-chalk hover:bg-clay"
                        }`}
                      >
                        <div className="font-semibold">{formatLabel(night.format)}</div>
                        <div className="mt-0.5 truncate text-[0.65rem] opacity-90">
                          {cityLabel(night.city)} · {left} left
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
