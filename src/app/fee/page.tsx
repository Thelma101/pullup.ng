import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What the fee pays for",
};

export default function FeePage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Pricing</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          The seat fee, explained.
        </h1>
        <p className="mt-5 text-lg text-steel">About a third of people ask. Here’s the whole answer.</p>

        <div className="mt-12 rounded-2xl bg-void px-7 py-9 text-chalk">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Typical dinner night
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <span>Your seat</span>
              <span className="font-display text-3xl font-bold">₦10,000</span>
            </div>
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <span>Food & drinks</span>
              <span className="font-display text-3xl font-bold">₦25,000+</span>
            </div>
            <div className="flex items-end justify-between gap-4 pt-1 text-sm">
              <span className="text-white/50">PullUp Pass</span>
              <span className="text-signal">Later — up to 3 nights / month</span>
            </div>
          </div>
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold">What it pays for</h2>
        <ul className="mt-5 space-y-3 text-steel">
          <li>• Reading applications and building a table that should talk</li>
          <li>• Booking and holding the restaurant</li>
          <li>• Conversation cards when talk needs a nudge</li>
          <li>• Mostly: making people turn up</li>
        </ul>

        <h2 className="mt-12 font-display text-2xl font-semibold">What it is not</h2>
        <ul className="mt-5 space-y-3 text-steel">
          <li>• Not your food or drinks</li>
          <li>• Not a dating fee</li>
          <li>• Not unlimited nights — one fee, one seat (for now)</li>
        </ul>

        <Link href="/nights" className="btn-primary mt-10 inline-flex">
          See nights
        </Link>
      </div>
    </div>
  );
}
