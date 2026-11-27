"use client";

import { FormEvent, useState } from "react";
import { formatNaira } from "@/lib/nights";

type OpsPayload = {
  summary: {
    members: number;
    paidBookings: number;
    pendingBookings: number;
    noShows: number;
    activePasses: number;
    communityLeads: number;
  };
  community: Array<{
    id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    state?: string;
    area?: string;
    aboutYou?: string;
    whatsapp: string;
    city?: string;
    email?: string;
    createdAt: string;
  }>;
  members: Array<{
    id: string;
    fullName: string;
    email: string;
    city: string;
    creditNaira: number;
    passCredits: number;
    referralCode: string;
    createdAt: string;
  }>;
  bookings: Array<{
    id: string;
    ref: string;
    fullName: string;
    email: string;
    nightId: string;
    feeNaira: number;
    paymentStatus: string;
    createdAt: string;
  }>;
  passes: Array<{
    id: string;
    fullName: string;
    email: string;
    plan: string;
    amountNaira: number;
    paymentStatus: string;
    createdAt: string;
  }>;
};

export default function OpsPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState<OpsPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/ops?key=${encodeURIComponent(key)}`, {
        headers: { "x-ops-key": key },
      });
      const text = await res.text();
      let json: OpsPayload & { error?: string };
      try {
        json = text ? JSON.parse(text) : ({} as OpsPayload);
      } catch {
        throw new Error("Ops API returned invalid JSON — is the server / Mongo up?");
      }
      if (!res.ok) throw new Error(json.error || `Unauthorized (${res.status})`);
      setData(json);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Could not load ops");
    } finally {
      setLoading(false);
    }
  }

  async function markNoShow(bookingId: string) {
    const res = await fetch(`/api/ops?key=${encodeURIComponent(key)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-ops-key": key,
      },
      body: JSON.stringify({ bookingId, paymentStatus: "no_show" }),
    });
    if (res.ok) await load();
  }

  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Internal</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">Ops dashboard</h1>
        <p className="mt-3 text-steel">Members, payments, passes, no-shows — no spreadsheet.</p>

        <form onSubmit={load} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            className="field sm:max-w-sm"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Ops key"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Loading…" : "Open dashboard"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-clay">{error}</p>}

        {data && (
          <div className="mt-12 space-y-12">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {[
                ["Members", data.summary.members],
                ["Paid seats", data.summary.paidBookings],
                ["Pending", data.summary.pendingBookings],
                ["No-shows", data.summary.noShows],
                ["Passes", data.summary.activePasses],
                ["WhatsApp leads", data.summary.communityLeads],
              ].map(([label, value]) => (
                <div key={label as string} className="rounded-2xl border border-line bg-chalk-hot px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            <section>
              <h2 className="font-display text-2xl font-semibold">Bookings</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {data.bookings.map((b) => (
                  <div key={b.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{b.fullName} · {b.ref}</p>
                      <p className="text-sm text-steel">
                        {b.email} · {b.nightId} · {formatNaira(b.feeNaira)} · {b.paymentStatus}
                      </p>
                    </div>
                    {b.paymentStatus === "paid" && (
                      <button type="button" className="btn-secondary" onClick={() => markNoShow(b.id)}>
                        Mark no-show
                      </button>
                    )}
                  </div>
                ))}
                {data.bookings.length === 0 && <p className="py-8 text-steel">No bookings yet.</p>}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Members</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {data.members.map((m) => (
                  <div key={m.id} className="py-4">
                    <p className="font-semibold">{m.fullName}</p>
                    <p className="text-sm text-steel">
                      {m.email} · {m.city} · code {m.referralCode} · credit {formatNaira(m.creditNaira)} · pass{" "}
                      {m.passCredits}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">Passes</h2>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {data.passes.map((p) => (
                  <div key={p.id} className="py-4">
                    <p className="font-semibold">
                      {p.fullName} · {p.plan}
                    </p>
                    <p className="text-sm text-steel">
                      {p.email} · {formatNaira(p.amountNaira)} · {p.paymentStatus}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold">WhatsApp community leads</h2>
              <p className="mt-2 text-sm text-steel">Add these numbers to the general group manually.</p>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {(data.community || []).map((c) => (
                  <div key={c.id} className="py-4">
                    <p className="font-semibold">{c.fullName}</p>
                    <p className="text-sm text-steel">
                      {c.whatsapp}
                      {c.age != null ? ` · ${c.age}` : ""}
                      {c.state ? ` · ${c.state}` : ""}
                      {c.area || c.city ? ` · ${c.area || c.city}` : ""}
                      {c.email ? ` · ${c.email}` : ""}
                    </p>
                    {c.aboutYou && <p className="mt-1 text-sm text-void/80">{c.aboutYou}</p>}
                  </div>
                ))}
                {(data.community || []).length === 0 && (
                  <p className="py-8 text-steel">No community signups yet.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
