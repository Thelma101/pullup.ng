import type { Metadata } from "next";
import { Suspense } from "react";
import { AgainForm } from "@/components/AgainForm";

export const metadata: Metadata = {
  title: "Pull Up again?",
};

export default function AgainPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">After the table</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Pull Up again?
        </h1>
        <p className="mt-5 text-lg text-steel">
          Optional. If you already swapped numbers, you’re good — skip this.
        </p>
        <p className="mt-3 text-steel">
          Name someone from your table. We’ll message them to confirm. If they say yes, we connect
          you both by email.
        </p>
        <Suspense fallback={<p className="mt-10 text-steel">Loading…</p>}>
          <AgainForm />
        </Suspense>
      </div>
    </div>
  );
}
