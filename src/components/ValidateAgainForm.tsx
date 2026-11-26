"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ValidateAgainForm() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(decision: "approve" | "decline", e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = e?.currentTarget;
    const fd = form ? new FormData(form) : null;
    const targetEmail = fd ? String(fd.get("targetEmail") || "").trim().toLowerCase() : "";
    const targetName = fd ? String(fd.get("targetName") || "").trim() : "";

    try {
      const res = await fetch("/api/reconnect/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, decision, targetEmail, targetName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(data.message);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <p className="mt-10 text-steel">This link is missing a token.</p>;
  }

  if (done) {
    return (
      <p className="mt-10 rounded-xl border border-signal/40 bg-signal/15 px-4 py-3 text-sm text-void">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={(e) => submit("approve", e)} className="mt-10 space-y-4 rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
      <p className="text-sm text-steel">
        Someone from your PullUp table wants to reconnect. Confirm below and we’ll introduce you by
        email — only if you say yes.
      </p>
      <div>
        <label className="field-label" htmlFor="targetName">Your name</label>
        <input id="targetName" name="targetName" required className="field" placeholder="Ada" />
      </div>
      <div>
        <label className="field-label" htmlFor="targetEmail">Your email</label>
        <input
          id="targetEmail"
          name="targetEmail"
          type="email"
          required
          className="field"
          placeholder="you@email.com"
        />
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
          {loading ? "Saving…" : "Yes — connect us"}
        </button>
        <button
          type="button"
          disabled={loading}
          className="btn-secondary flex-1 disabled:opacity-60"
          onClick={() => submit("decline")}
        >
          No thanks
        </button>
      </div>
    </form>
  );
}
