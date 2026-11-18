"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { formatLabel, formatNaira, formatNightDate } from "@/lib/nights";

type MePayload = {
  member: {
    fullName: string;
    email: string;
    creditNaira: number;
    passCredits: number;
    referralCode: string;
    city: string;
  } | null;
  upcoming: Array<{
    booking: { ref: string; nightId: string };
    night: { format: string; date: string; time: string; area: string; city: string } | null;
  }>;
  past: Array<{
    booking: { ref: string; nightId: string; paymentStatus: string };
    night: { format: string; date: string; time: string; area: string } | null;
  }>;
  waitlist: Array<{ nightId: string; status: string }>;
};

export function MemberHome() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<MePayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/me?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(json.error || "Could not load");
      setData(json);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Could not load account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          className="field sm:max-w-md"
          placeholder="Email you booked with"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Loading…" : "Open my home"}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-clay">{error}</p>}

      {data && (
        <div className="mt-10 space-y-10">
          {data.member ? (
            <div className="rounded-2xl border border-line bg-chalk-hot p-6">
              <p className="font-display text-2xl font-semibold">{data.member.fullName}</p>
              <p className="mt-2 text-sm text-steel">
                Pass credits: <strong className="text-void">{data.member.passCredits}</strong>
                {" · "}
                Referral credit: <strong className="text-void">{formatNaira(data.member.creditNaira)}</strong>
                {" · "}
                Code: <strong className="font-mono text-void">{data.member.referralCode}</strong>
              </p>
              <p className="mt-3 text-sm text-steel">
                Share{" "}
                <Link className="underline" href={`/apply?ref=${data.member.referralCode}`}>
                  your invite link
                </Link>{" "}
                — you both get ₦2,000.
              </p>
            </div>
          ) : (
            <p className="text-steel">
              No account yet for that email.{" "}
              <Link href="/apply" className="font-semibold underline">
                Create one
              </Link>
              .
            </p>
          )}

          <section>
            <h2 className="font-display text-2xl font-semibold">Upcoming seat</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {data.upcoming.length === 0 && <p className="py-6 text-steel">No upcoming hangouts.</p>}
              {data.upcoming.map(({ booking, night }) => (
                <div key={booking.ref} className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">
                      {night ? formatLabel(night.format) : booking.nightId} · {booking.ref}
                    </p>
                    {night && (
                      <p className="text-sm text-steel">
                        {formatNightDate(night.date)} · {night.time} · {night.area}
                      </p>
                    )}
                  </div>
                  <Link href={`/nights/${booking.nightId}`} className="btn-secondary">
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Past hangouts</h2>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {data.past.length === 0 && <p className="py-6 text-steel">None yet — book your first.</p>}
              {data.past.map(({ booking, night }) => (
                <div key={booking.ref} className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">
                      {night ? formatLabel(night.format) : booking.nightId}
                    </p>
                    {night && (
                      <p className="text-sm text-steel">
                        {formatNightDate(night.date)} · {booking.paymentStatus}
                      </p>
                    )}
                  </div>
                  <Link href={`/again?ref=${encodeURIComponent(booking.ref)}&email=${encodeURIComponent(email)}`} className="btn-secondary">
                    Pull Up again?
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {data.waitlist.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold">Waitlists</h2>
              <ul className="mt-4 space-y-2 text-sm text-steel">
                {data.waitlist.map((w) => (
                  <li key={`${w.nightId}-${w.status}`}>
                    {w.nightId} · {w.status}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
