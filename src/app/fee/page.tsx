import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PassCheckout } from "@/components/PassCheckout";
import { PassStatus } from "@/components/PassStatus";
import { PASS_PLANS } from "@/lib/pricing";
import { formatNaira } from "@/lib/nights";

export const metadata: Metadata = {
  title: "Pricing & Pass",
};

export default function FeePage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Pricing</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          What you pay.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-steel">
          Seat fee to PullUp. Food &amp; drinks on you at the venue.
        </p>

        <div className="mt-12 max-w-3xl rounded-2xl bg-void px-7 py-9 text-chalk">
          <div className="space-y-5">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p>Seat (per hangout)</p>
                <p className="mt-1 text-xs text-white/45">Paystack checkout</p>
              </div>
              <span className="font-display text-3xl font-bold">₦8k–₦10k</span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p>Food &amp; drinks</p>
                <p className="mt-1 text-xs text-white/45">On you — pay at the venue</p>
              </div>
              <span className="font-display text-3xl font-bold">from ₦15,000</span>
            </div>
          </div>
        </div>

        <div id="pass" className="mt-20 scroll-mt-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">PullUp Pass</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Come more than once. Pay less.
          </h2>
          <p className="mt-4 max-w-2xl text-steel">
            One-off seats add up (3 × ₦10k = ₦30k). The Pass locks in hangouts for less, and you can
            mix dinner, drinks, beach, brunch — different people each time.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-void-soft">
            <li>
              • {formatNaira(PASS_PLANS.pass_3.amountNaira)} for 3 hangouts — save about{" "}
              {formatNaira(PASS_PLANS.pass_3.saveNaira)}
            </li>
            <li>
              • {formatNaira(PASS_PLANS.pass_5.amountNaira)} for 5 hangouts — save about{" "}
              {formatNaira(PASS_PLANS.pass_5.saveNaira)}
            </li>
            <li>• Credits apply when you book. Unused credits don’t unlock free networking chats.</li>
          </ul>

          <Suspense fallback={null}>
            <PassStatus />
          </Suspense>

          <div className="mt-10 max-w-xl rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
            <PassCheckout />
          </div>
        </div>

        <h2 className="mt-16 font-display text-2xl font-semibold">Refunds &amp; moves</h2>
        <ul className="mt-4 max-w-2xl space-y-2 text-steel">
          <li>• Full refund if you cancel 3+ days out, or if we cancel / the table doesn’t fill</li>
          <li>• Move free to another night in your city with 3+ days’ notice</li>
        </ul>

        <Link href="/nights" className="btn-primary mt-10 inline-flex">
          See hangouts
        </Link>
      </div>
    </div>
  );
}
