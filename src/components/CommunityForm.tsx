"use client";

import { FormEvent, useState } from "react";
import { NIGERIA_STATES } from "@/lib/nigeria-states";

export function CommunityForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(form.get("firstName") || "").trim(),
          lastName: String(form.get("lastName") || "").trim(),
          age: String(form.get("age") || "").trim(),
          state: String(form.get("state") || "").trim(),
          area: String(form.get("area") || "").trim(),
          aboutYou: String(form.get("aboutYou") || "").trim(),
          whatsapp: String(form.get("whatsapp") || "").trim(),
          email: String(form.get("email") || "").trim(),
          source: "community-page",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-signal/40 bg-signal/15 px-5 py-6 text-sm leading-relaxed text-void">
        You’re on the list. We’ll add you to the PullUp WhatsApp community shortly.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="firstName">
            First name
          </label>
          <input id="firstName" name="firstName" required className="field" placeholder="Ada" />
        </div>
        <div>
          <label className="field-label" htmlFor="lastName">
            Last name
          </label>
          <input id="lastName" name="lastName" required className="field" placeholder="Okafor" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="age">
          Age
        </label>
        <input
          id="age"
          name="age"
          required
          className="field"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="28"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="state">
          State
        </label>
        <select id="state" name="state" required className="field cursor-pointer" defaultValue="">
          <option value="" disabled>
            Choose state…
          </option>
          {NIGERIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="area">
          Where you live
        </label>
        <input
          id="area"
          name="area"
          required
          className="field"
          placeholder="e.g. Ikeja, Lekki, Ajah"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="aboutYou">
          3 things we should know about you
        </label>
        <textarea
          id="aboutYou"
          name="aboutYou"
          required
          rows={4}
          className="field resize-y"
          placeholder="What you do, what you like, anything that helps us get you…"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="whatsapp">
          WhatsApp number
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          required
          className="field"
          inputMode="tel"
          placeholder="0803… or +234…"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="email">
          Email (optional)
        </label>
        <input id="email" name="email" type="email" className="field" placeholder="you@email.com" />
      </div>
      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Sending…" : "Join the community"}
      </button>
    </form>
  );
}
