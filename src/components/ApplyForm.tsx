"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Draft = {
  fullName: string;
  age: string;
  whatsapp: string;
  city: string;
  area: string;
  tablePreference: string;
  reason: string;
  dietary: string;
  howFound: string;
};

const empty: Draft = {
  fullName: "",
  age: "",
  whatsapp: "",
  city: "",
  area: "",
  tablePreference: "mixed",
  reason: "",
  dietary: "",
  howFound: "",
};

export function ApplyForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    setError("");
    if (step === 0) {
      if (!draft.fullName.trim() || !draft.whatsapp.trim() || Number(draft.age) < 21) {
        setError("Name, WhatsApp, and age 21+ are required.");
        return;
      }
    }
    if (step === 1) {
      if (!draft.city || !draft.area.trim()) {
        setError("Choose a city and tell us your area.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (draft.reason.trim().length < 12) {
      setError("Tell us a little more about why you want to join.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          age: Number(draft.age),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push(
        `/thanks?name=${encodeURIComponent(draft.fullName.split(" ")[0])}&city=${draft.city}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Try again.");
      setLoading(false);
    }
  }

  const steps = ["You", "City", "Why"];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i < step && setStep(i)}
            className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold transition ${
              i === step
                ? "bg-void text-chalk"
                : i < step
                  ? "bg-signal text-signal-ink"
                  : "bg-fog text-steel"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              className="field"
              value={draft.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Ada Okafor"
              autoComplete="name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                min={21}
                className="field"
                value={draft.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="21+"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="whatsapp">WhatsApp</label>
              <input
                id="whatsapp"
                className="field"
                value={draft.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="0803… or +234…"
                inputMode="tel"
              />
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="city">City</label>
            <div className="grid grid-cols-2 gap-3">
              {(["lagos", "abuja"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("city", c)}
                  className={`rounded-xl border px-4 py-4 text-left font-semibold capitalize transition ${
                    draft.city === c
                      ? "border-void bg-void text-chalk"
                      : "border-line bg-chalk-hot hover:border-void/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="area">Area</label>
            <input
              id="area"
              className="field"
              value={draft.area}
              onChange={(e) => update("area", e.target.value)}
              placeholder="Lekki, Ikeja, Wuse…"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="tablePreference">Who at your table?</label>
            <select
              id="tablePreference"
              className="field"
              value={draft.tablePreference}
              onChange={(e) => update("tablePreference", e.target.value)}
            >
              <option value="mixed">Mixed table</option>
              <option value="women-only">Women-only</option>
              <option value="men-only">Men-only</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="reason">Why do you want to Pull Up?</label>
            <textarea
              id="reason"
              rows={4}
              className="field"
              value={draft.reason}
              onChange={(e) => update("reason", e.target.value)}
              placeholder="New in town, tired of empty weekends, want people outside work…"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="dietary">Dietary needs (optional)</label>
            <input
              id="dietary"
              className="field"
              value={draft.dietary}
              onChange={(e) => update("dietary", e.target.value)}
              placeholder="Halal, vegetarian, allergies…"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="howFound">How did you hear about us?</label>
            <input
              id="howFound"
              className="field"
              value={draft.howFound}
              onChange={(e) => update("howFound", e.target.value)}
              placeholder="Friend, Instagram…"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="btn-secondary flex-1"
          >
            Back
          </button>
        )}
        {step < 2 ? (
          <button type="button" onClick={next} className="btn-primary flex-[1.4]">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={loading} className="btn-primary flex-[1.4] disabled:opacity-60">
            {loading ? "Sending…" : "Request my invite"}
          </button>
        )}
      </div>

      <p className="text-center text-xs leading-relaxed text-steel">
        Invite-only · 21+ · After WhatsApp verify, we send your city group — Lagos or Abuja, never mixed.
      </p>
    </form>
  );
}
