import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
};

const steps = [
  {
    title: "Apply",
    body: "Name, age, WhatsApp, city, area, why you’re here, and who you’d like at your table.",
  },
  {
    title: "We verify",
    body: "A quick WhatsApp check. Then you get the Lagos or Abuja invite — never a mixed mega-chat.",
  },
  {
    title: "Introduce yourself",
    body: "Pinned template: name, area, light “what you do,” why you’re here, one hobby.",
  },
  {
    title: "Book a night",
    body: "Dinner, brunch, or drinks. Pay the seat fee. We build a table of 4–5 on purpose.",
  },
  {
    title: "Know a little",
    body: "A few days out: what people roughly do. Morning of: the venue — enough time for traffic.",
  },
  {
    title: "Show up alone",
    body: "No plus-ones. Afterward you can quietly pick who you’d Pull Up with again.",
  },
];

export default function HowPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">How PullUp works</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          From form to table.
        </h1>
        <p className="mt-5 text-lg text-steel">
          Built for real weekends — not a bloated social network.
        </p>

        <ol className="mt-12">
          {steps.map((step, i) => (
            <li key={step.title} className="grid gap-2 border-t border-line py-8 md:grid-cols-[5rem_1fr]">
              <span className="font-display text-sm font-bold text-clay">0{i + 1}</span>
              <div>
                <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
                <p className="mt-3 leading-relaxed text-steel">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/apply" className="btn-primary text-center">
            Request an invite
          </Link>
          <Link href="/nights" className="btn-secondary text-center">
            Browse nights
          </Link>
        </div>
      </div>
    </div>
  );
}
