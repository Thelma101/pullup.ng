import Link from "next/link";
import type { Night } from "@/lib/types";
import {
  cityLabel,
  formatLabel,
  formatNaira,
  formatNightDate,
  seatsLeft,
} from "@/lib/nights";

export function NightCard({ night }: { night: Night }) {
  const left = seatsLeft(night);
  const full = left === 0 || night.status === "full";

  return (
    <article className="group grid items-center gap-4 border-b border-line py-7 transition hover:bg-chalk-hot/70 md:grid-cols-[7rem_1fr_auto_auto] md:gap-8 md:px-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
          {cityLabel(night.city)}
        </p>
        <p className="mt-1 font-display text-lg font-semibold md:hidden">
          {formatLabel(night.format)}
        </p>
      </div>

      <div>
        <h3 className="hidden font-display text-2xl font-semibold tracking-tight md:block">
          {formatLabel(night.format)}
        </h3>
        <p className="text-sm text-steel md:mt-1">
          {formatNightDate(night.date)} · {night.time} · {night.area}
        </p>
        <p className="mt-1 text-sm text-void-soft md:hidden">
          Seat {formatNaira(night.feeNaira)}
        </p>
      </div>

      <div className="hidden text-right md:block">
        <p className="text-sm font-semibold">{formatNaira(night.feeNaira)} seat</p>
        <p className="mt-1 text-xs text-steel">
          {full ? "Full" : night.status === "filling" ? `${left} left` : `${left} open`}
        </p>
      </div>

      <div>
        {full ? (
          <span className="inline-flex min-w-[8.5rem] items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-steel">
            Full
          </span>
        ) : (
          <Link
            href={`/nights/${night.id}`}
            className="inline-flex min-w-[8.5rem] items-center justify-center rounded-lg bg-void px-4 py-2.5 text-sm font-semibold text-chalk transition group-hover:bg-signal"
          >
            Take a seat
          </Link>
        )}
      </div>
    </article>
  );
}
