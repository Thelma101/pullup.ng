"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AgainForm() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRef: String(form.get("bookingRef") || "").trim(),
          fromEmail: String(form.get("fromEmail") || "").trim().toLowerCase(),
          fromName: String(form.get("fromName") || "").trim(),
          targetLabel: String(form.get("targetLabel") || "").trim(),
          note: String(form.get("note") || "").trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
      <div>
        <label className="field-label" htmlFor="bookingRef">Booking ref</label>
        <input
          id="bookingRef"
          name="bookingRef"
          required
          className="field"
          defaultValue={params.get("ref") || ""}
          placeholder="PU-LA-123456"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="fromEmail">Your email</label>
        <input
          id="fromEmail"
          name="fromEmail"
          type="email"
          required
          className="field"
          defaultValue={params.get("email") || ""}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="fromName">Your name (as they knew you)</label>
        <input id="fromName" name="fromName" required className="field" placeholder="Ada" />
      </div>
      <div>
        <label className="field-label" htmlFor="targetLabel">Who would you Pull Up with again?</label>
        <input
          id="targetLabel"
          name="targetLabel"
          required
          className="field"
          placeholder="First name or nickname from the table"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="note">Optional note</label>
        <input id="note" name="note" className="field" placeholder="Great energy, same city…" />
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      {message && <p className="rounded-xl bg-signal/15 px-4 py-3 text-sm text-void">{message}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
        {loading ? "Saving…" : "Send opt-in"}
      </button>
    </form>
  );
}
