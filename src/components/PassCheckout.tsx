"use client";

import { FormEvent, useState } from "react";
import { PASS_PLANS } from "@/lib/pricing";
import { formatNaira } from "@/lib/nights";
import type { PassPlan } from "@/lib/types";

export function PassCheckout() {
  const [plan, setPlan] = useState<PassPlan>("pass_3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          fullName: String(form.get("fullName") || "").trim(),
          email: String(form.get("email") || "").trim().toLowerCase(),
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (!data.authorization_url) throw new Error("No Paystack checkout URL returned");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(PASS_PLANS) as PassPlan[]).map((key) => {
          const p = PASS_PLANS[key];
          const active = plan === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPlan(key)}
              className={`cursor-pointer rounded-2xl border px-5 py-5 text-left transition ${
                active ? "border-void bg-void text-chalk" : "border-line bg-chalk-hot hover:border-void/30"
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${active ? "text-white/55" : "text-steel"}`}>
                {p.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold">{formatNaira(p.amountNaira)}</p>
              <p className={`mt-2 text-sm ${active ? "text-white/70" : "text-steel"}`}>{p.blurb}</p>
            </button>
          );
        })}
      </div>

      <div>
        <label className="field-label" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required className="field" />
      </div>
      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="field" />
      </div>

      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Opening Paystack…" : `Pay ${formatNaira(PASS_PLANS[plan].amountNaira)} with Paystack`}
      </button>
      <p className="text-center text-xs text-steel">
        Secured by Paystack · card, transfer, OPay. Without keys in `.env`, demo checkout still completes locally.
      </p>
    </form>
  );
}
