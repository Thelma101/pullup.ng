"use client";

import { FormEvent, useState } from "react";

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
          fullName: String(form.get("fullName") || "").trim(),
          whatsapp: String(form.get("whatsapp") || "").trim(),
          city: String(form.get("city") || "").trim(),
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
      <div>
        <label className="field-label" htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required className="field" placeholder="Ada Okafor" />
      </div>
      <div>
        <label className="field-label" htmlFor="whatsapp">WhatsApp number</label>
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
        <label className="field-label" htmlFor="city">City</label>
        <select id="city" name="city" required className="field cursor-pointer" defaultValue="">
          <option value="" disabled>
            Choose one…
          </option>
          <option value="lagos">Lagos</option>
          <option value="abuja">Abuja</option>
          <option value="other">Other / visiting</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="email">Email (optional)</label>
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
