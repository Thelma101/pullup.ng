"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
  const flash = night.status === "flash" && left > 0;
  const [waitOpen, setWaitOpen] = useState(false);
  const [waitMsg, setWaitMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinWaitlist(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setWaitMsg("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nightId: night.id,
          fullName: String(form.get("fullName") || "").trim(),
          email: String(form.get("email") || "").trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setWaitMsg("You’re on the waitlist. We’ll email if a seat opens.");
      setWaitOpen(false);
    } catch (err) {
      setWaitMsg(err instanceof Error ? err.message : "Could not join waitlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="group border-b border-line py-7 transition hover:bg-chalk-hot/70 md:px-3">
      <div className="grid items-center gap-4 md:grid-cols-[7rem_1fr_auto_auto] md:gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
            {cityLabel(night.city)}
          </p>
          {flash && (
            <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wide text-[#b42318]">
              Flash seat
            </p>
          )}
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
            {full
              ? "Full"
              : flash
                ? `${left} flash open`
                : night.status === "filling"
                  ? `${left} left`
                  : `${left} open`}
          </p>
        </div>

        <div>
          {full ? (
            <button
              type="button"
              onClick={() => setWaitOpen((v) => !v)}
              className="inline-flex min-w-[8.5rem] cursor-pointer items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-void"
            >
              Join waitlist
            </button>
          ) : (
            <Link
              href={`/nights/${night.id}`}
              className="inline-flex min-w-[8.5rem] items-center justify-center rounded-lg bg-void px-4 py-2.5 text-sm font-semibold text-chalk transition group-hover:bg-signal"
            >
              {flash ? "Grab flash seat" : "Take a seat"}
            </Link>
          )}
        </div>
      </div>

      {waitOpen && (
        <form onSubmit={joinWaitlist} className="mt-4 grid gap-3 rounded-xl border border-line bg-chalk-hot p-4 md:grid-cols-[1fr_1fr_auto]">
          <input name="fullName" required className="field" placeholder="Full name" />
          <input name="email" type="email" required className="field" placeholder="Email" />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving…" : "Join"}
          </button>
        </form>
      )}
      {waitMsg && <p className="mt-3 text-sm text-steel">{waitMsg}</p>}
    </article>
  );
}
