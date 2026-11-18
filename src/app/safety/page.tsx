import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Safety",
};

const EMERGENCY_WHATSAPP = "2348000000000"; // replace with live ops number

export default function SafetyPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Trust</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Strangers, with guardrails.
        </h1>
        <p className="mt-5 text-lg text-steel">
          Public venues. Small tables. You can leave anytime.
        </p>

        <div className="mt-12 space-y-0">
          {[
            {
              t: "Account + payment",
              d: "Create an account with email, then book and pay. We remove people who break trust.",
            },
            {
              t: "Women-only / men-only tables",
              d: "Ask when you apply or book. Mixed tables stay available.",
            },
            {
              t: "Public venues only",
              d: "Restaurants, cafés, beaches, parks — not private homes. Area when you book; exact spot 24 hours before.",
            },
            {
              t: "Arrive alone, leave on your terms",
              d: "Want to reconnect later? Ask via Pull Up again — they confirm before we share emails.",
            },
            {
              t: "Report & remove",
              d: "Use the emergency button below, or email hello@pullup.ng. Harassment ends membership.",
            },
          ].map((item) => (
            <div key={item.t} className="border-t border-line py-8">
              <h2 className="font-display text-2xl font-semibold">{item.t}</h2>
              <p className="mt-3 leading-relaxed text-steel">{item.d}</p>
            </div>
          ))}
        </div>

        <Link href="/apply" className="btn-primary mt-10 inline-flex">
          Create account
        </Link>

        <a
          href={`https://wa.me/${EMERGENCY_WHATSAPP}?text=${encodeURIComponent("PullUp emergency — I need help now.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 flex w-full items-center justify-between gap-4 rounded-2xl bg-[#b42318] px-6 py-5 text-left text-white transition hover:bg-[#912018]"
        >
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              Emergency
            </span>
            <span className="mt-1 block font-display text-xl font-semibold">
              Feel unsafe? Leave.
            </span>
            <span className="mt-1 block text-sm text-white/80">
              If you need to report, then tap here. Opens WhatsApp to PullUp ops.
            </span>
          </span>
          <span className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold">
            Message now
          </span>
        </a>
      </div>
    </div>
  );
}
