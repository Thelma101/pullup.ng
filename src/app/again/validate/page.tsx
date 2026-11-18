import type { Metadata } from "next";
import { Suspense } from "react";
import { ValidateAgainForm } from "@/components/ValidateAgainForm";

export const metadata: Metadata = {
  title: "Confirm reconnect",
};

export default function ValidateAgainPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-2xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Pull Up again</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Someone wants to reconnect.
        </h1>
        <p className="mt-5 text-lg text-steel">
          You’re in control. Approve and we’ll email-intro you both. Decline and nothing happens.
        </p>
        <Suspense fallback={<p className="mt-10 text-steel">Loading…</p>}>
          <ValidateAgainForm />
        </Suspense>
      </div>
    </div>
  );
}
