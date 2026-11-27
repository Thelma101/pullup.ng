"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Night } from "@/lib/types";
import { formatNaira } from "@/lib/nights";

export function BookingForm({ night }: { night: Night }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usePass, setUsePass] = useState(true);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const payload = {
      nightId: night.id,
      fullName: String(form.get("fullName") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      tablePreference: String(form.get("tablePreference") || "mixed"),
      dietary: String(form.get("dietary") || "").trim(),
      budgetBand: String(form.get("budgetBand") || "moderate"),
      usePass,
      useCredit: true,
    };

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Booking failed");

      if (data.paid && data.redirectTo) {
        router.push(data.redirectTo);
        return;
      }
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book. Try again.");
      setLoading(false);
    }
  }

  const cta = usePass
    ? "Book with Pass credit (or Paystack if none)"
    : `Pay ${formatNaira(night.feeNaira)} with Paystack`;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-2xl bg-void px-5 py-5 text-chalk">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Seat</p>
            <p className="mt-1 font-display text-4xl font-bold">{formatNaira(night.feeNaira)}</p>
          </div>
          <p className="max-w-[10rem] text-right text-xs leading-relaxed text-white/50">
            Food &amp; drinks from {formatNaira(night.minSpendNaira)} at the venue
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-4">
          <div>
            <label className="field-label" htmlFor="fullName">
              Full name
            </label>
            <input id="fullName" name="fullName" required className="field" autoComplete="name" placeholder="Ada Okafor" />
          </div>
          <div className="mt-4 sm:mt-0">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="field"
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="tablePreference">
            Table
          </label>
          <select id="tablePreference" name="tablePreference" className="field cursor-pointer" defaultValue="mixed">
            <option value="mixed">Mixed</option>
            <option value="women-only">Women-only</option>
            <option value="men-only">Men-only</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="budgetBand">
            Food budget
          </label>
          <select id="budgetBand" name="budgetBand" className="field cursor-pointer" defaultValue="moderate">
            <option value="moderate">~{formatNaira(night.minSpendNaira)}</option>
            <option value="comfortable">Comfortable</option>
            <option value="open">Open</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="dietary">
            Dietary (optional)
          </label>
          <input id="dietary" name="dietary" className="field" placeholder="Halal, veg, allergies…" />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-void">
        <input
          type="checkbox"
          checked={usePass}
          onChange={(e) => setUsePass(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--signal)]"
        />
        <span>
          <span className="font-semibold">Use 1 Pass credit</span>
          <span className="mt-0.5 block text-steel">If you have a Pass, this books free. If not, we send you to Paystack.</span>
        </span>
      </label>

      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "One moment…" : cta}
      </button>
      <p className="text-center text-xs text-steel">Paystack · card, transfer, OPay</p>
    </form>
  );
}
