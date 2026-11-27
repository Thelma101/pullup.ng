import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PassCheckout } from "@/components/PassCheckout";
import { PassStatus } from "@/components/PassStatus";

export const metadata: Metadata = {
  title: "Pricing & Pass",
};

export default function FeePage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Pricing</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">Seats &amp; Passes</h1>
        <p className="mt-4 max-w-xl text-lg text-steel">
          Seat fee to us. Food &amp; drinks on you at the venue.
        </p>

        <div className="mt-10 divide-y divide-line border-y border-line">
          <div className="flex items-baseline justify-between gap-4 py-5">
            <div>
              <p className="font-semibold text-void">Seat</p>
              <p className="text-sm text-steel">Dinner, drinks, beach, games…</p>
            </div>
            <p className="font-display text-2xl font-bold">₦10k</p>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-5">
            <div>
              <p className="font-semibold text-void">Brunch</p>
              <p className="text-sm text-steel">Lighter seat</p>
            </div>
            <p className="font-display text-2xl font-bold">₦8k</p>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-5">
            <div>
              <p className="font-semibold text-void">Food &amp; drinks</p>
              <p className="text-sm text-steel">Pay at the venue</p>
            </div>
            <p className="font-display text-2xl font-bold">from ₦15k</p>
          </div>
        </div>

        <div id="pass" className="mt-16 scroll-mt-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Pass</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Come often. Spend less.</h2>
          <p className="mt-3 max-w-xl text-steel">
            Three one-offs ≈ ₦30k. A Pass is cheaper — mix vibes, new people each time. One credit = one seat.
          </p>

          <Suspense fallback={null}>
            <PassStatus />
          </Suspense>

          <div className="mt-8 rounded-2xl border border-line bg-chalk-hot p-5 md:p-7">
            <PassCheckout />
          </div>
        </div>

        <div className="mt-14 text-sm text-steel">
          <p className="font-semibold text-void">Refunds</p>
          <p className="mt-2">Full refund if you cancel 3+ days out, or if we cancel / the table doesn’t fill. Free move to another night in your city with 3+ days’ notice.</p>
        </div>

        <Link href="/nights" className="btn-primary mt-10 inline-flex">
          See hangouts
        </Link>
      </div>
    </div>
  );
}
