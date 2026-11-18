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
      email: String(form.get("email") || "").trim().toLowerCase(),
      tablePreference: String(form.get("tablePreference") || "mixed"),
      dietary: String(form.get("dietary") || "").trim(),
      budgetBand: String(form.get("budgetBand") || "moderate"),
      usePass: form.get("usePass") === "on",
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

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-2xl bg-void px-5 py-5 text-chalk">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Seat fee</p>
        <p className="mt-1 font-display text-4xl font-bold">{formatNaira(night.feeNaira)}</p>
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/70">
          <p>
            <span className="font-semibold text-white">Food &amp; drinks:</span>{" "}
            from {formatNaira(night.minSpendNaira)} — on you, paid at the venue.
          </p>
          <p className="text-white/50">Paystack checkout next. Pass credits / referral credit apply if you have them.</p>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required className="field" />
      </div>
      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="field" autoComplete="email" />
      </div>
      <div>
        <label className="field-label" htmlFor="tablePreference">Table preference</label>
        <select id="tablePreference" name="tablePreference" className="field cursor-pointer" defaultValue="mixed">
          <option value="mixed">Mixed</option>
          <option value="women-only">Women-only</option>
          <option value="men-only">Men-only</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="budgetBand">Budget for food &amp; drinks</label>
        <select id="budgetBand" name="budgetBand" className="field cursor-pointer" defaultValue="moderate">
          <option value="moderate">Moderate (~{formatNaira(night.minSpendNaira)})</option>
          <option value="comfortable">Comfortable</option>
          <option value="open">Open</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="dietary">Dietary needs (optional)</label>
        <input id="dietary" name="dietary" className="field" placeholder="Halal, vegetarian, allergies…" />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-chalk px-4 py-3 text-sm">
        <input type="checkbox" name="usePass" className="size-4 accent-[var(--signal)]" />
        Use 1 PullUp Pass credit if I have any
      </label>

      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Opening Paystack…" : `Pay ${formatNaira(night.feeNaira)} with Paystack`}
      </button>
      <p className="text-center text-xs text-steel">Secured by Paystack · card, transfer, OPay</p>
    </form>
  );
}
