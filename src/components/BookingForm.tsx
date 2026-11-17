"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Night } from "@/lib/types";
import { formatNaira } from "@/lib/nights";

export function BookingForm({ night }: { night: Night }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      nightId: night.id,
      fullName: String(form.get("fullName") || "").trim(),
      whatsapp: String(form.get("whatsapp") || "").trim(),
      tablePreference: String(form.get("tablePreference") || "mixed"),
      dietary: String(form.get("dietary") || "").trim(),
      budgetBand: String(form.get("budgetBand") || "moderate"),
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/booked?night=${encodeURIComponent(night.id)}&ref=${encodeURIComponent(data.ref)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-2xl bg-void px-5 py-5 text-chalk">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          Seat fee
        </p>
        <p className="mt-1 font-display text-4xl font-bold">{formatNaira(night.feeNaira)}</p>
        <p className="mt-3 text-sm text-white/55">
          Food & drinks separate — about {formatNaira(night.minSpendNaira)}+ at the venue.
          Paystack comes next; this demo holds your seat.
        </p>
      </div>

      <div>
        <label className="field-label" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required className="field" />
      </div>
      <div>
        <label className="field-label" htmlFor="whatsapp">WhatsApp (must match invite)</label>
        <input id="whatsapp" name="whatsapp" required className="field" inputMode="tel" />
      </div>
      <div>
        <label className="field-label" htmlFor="tablePreference">Table preference</label>
        <select id="tablePreference" name="tablePreference" className="field" defaultValue="mixed">
          <option value="mixed">Mixed</option>
          <option value="women-only">Women-only</option>
          <option value="men-only">Men-only</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="budgetBand">Budget for food & drinks</label>
        <select id="budgetBand" name="budgetBand" className="field" defaultValue="moderate">
          <option value="moderate">Moderate</option>
          <option value="comfortable">Comfortable</option>
          <option value="open">Open</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="dietary">Dietary needs</label>
        <input id="dietary" name="dietary" className="field" placeholder="Optional" />
      </div>

      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Holding your seat…" : "Hold my seat"}
      </button>
    </form>
  );
}
