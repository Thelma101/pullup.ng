import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Safety",
};

export default function SafetyPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Trust</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Strangers, with guardrails.
        </h1>
        <p className="mt-5 text-lg text-steel">
          Meeting offline is the product. Safety is the make-or-break layer.
        </p>

        <div className="mt-12 space-y-0">
          {[
            {
              t: "Invite + verify",
              d: "Apply, WhatsApp verify, city group. We can remove people who break the vibe.",
            },
            {
              t: "Women-only / men-only tables",
              d: "Ask when you apply or book. Mixed stays available.",
            },
            {
              t: "Public venues",
              d: "Restaurants and cafés — not private homes. Area known at book; spot the morning of.",
            },
            {
              t: "Arrive alone, leave on your terms",
              d: "Reconnect is mutual opt-in. We don’t dump numbers into a group chat.",
            },
            {
              t: "Report & remove",
              d: "Email hello@pullup.ng. Harassment ends membership.",
            },
            {
              t: "Still manual (on purpose)",
              d: "Solo-scale. Phone verify + human review now. Full ID KYC is on the upgrade shelf.",
            },
          ].map((item) => (
            <div key={item.t} className="border-t border-line py-8">
              <h2 className="font-display text-2xl font-semibold">{item.t}</h2>
              <p className="mt-3 leading-relaxed text-steel">{item.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-2xl bg-void px-6 py-5 text-sm leading-relaxed text-white/75">
          If you ever feel unsafe at a PullUp night, leave. Message us. Your seat fee is the least
          important part of that story.
        </p>

        <Link href="/apply" className="btn-primary mt-10 inline-flex">
          Request an invite
        </Link>
      </div>
    </div>
  );
}
