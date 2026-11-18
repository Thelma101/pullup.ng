import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
};

const steps = [
  { title: "Create account", body: "Name, email, city. That’s your registration." },
  { title: "Book a hangout", body: "Dinner, drinks, beach, picnic, games, or brunch. Pay with Paystack — or use a Pass credit." },
  { title: "Get the details", body: "Exact venue drops 24 hours before by email." },
  { title: "Show up alone", body: "No plus-ones. Food & drinks from ₦15,000 — on you at the venue." },
];

export default function HowPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">How PullUp works</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          From form to table.
        </h1>
        <p className="mt-5 text-lg text-steel">Four steps. That’s it.</p>

        <ol className="mt-12">
          {steps.map((step, i) => (
            <li key={step.title} className="grid gap-2 border-t border-line py-7 md:grid-cols-[5rem_1fr]">
              <span className="font-display text-sm font-bold text-clay">0{i + 1}</span>
              <div>
                <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-steel">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className="btn-primary text-center">
            Create account
          </Link>
          <Link href="/nights" className="btn-secondary text-center">
            Browse hangouts
          </Link>
        </div>
      </div>
    </div>
  );
}
