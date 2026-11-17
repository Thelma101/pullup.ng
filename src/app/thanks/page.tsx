"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ThanksInner() {
  const params = useSearchParams();
  const name = params.get("name") || "friend";
  const city = params.get("city") === "abuja" ? "Abuja" : "Lagos";

  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-20 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
          Application in
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Nice one, {name}.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-steel">
          We’ll WhatsApp you to verify, then send the{" "}
          <strong className="text-void">{city}</strong> PullUp group. Introduce yourself when
          you’re in.
        </p>
        <ol className="mt-10 space-y-3 border-l-2 border-signal pl-5 text-sm text-void-soft">
          <li>Watch WhatsApp for a short check from us</li>
          <li>Join your city group (Lagos ≠ Abuja)</li>
          <li>When nights open, hold a seat from the calendar</li>
        </ol>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/nights" className="btn-primary text-center">
            Peek at nights
          </Link>
          <Link href="/" className="btn-secondary text-center">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-steel">Loading…</div>}>
      <ThanksInner />
    </Suspense>
  );
}
