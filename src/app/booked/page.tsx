"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cityLabel, formatLabel, formatNightDate, getNight } from "@/lib/nights";

function BookedInner() {
  const params = useSearchParams();
  const nightId = params.get("night") || "";
  const ref = params.get("ref") || "BR-HOLD";
  const night = getNight(nightId);

  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-20 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Seat held</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          You’re on the table.
        </h1>
        {night ? (
          <p className="mt-6 text-lg text-steel">
            {formatLabel(night.format)} · {cityLabel(night.city)} · {formatNightDate(night.date)} at{" "}
            {night.time}
          </p>
        ) : (
          <p className="mt-6 text-steel">Your hold is saved.</p>
        )}
        <p className="mt-5 inline-flex w-fit rounded-lg bg-fog px-4 py-2 font-mono text-sm">
          Ref {ref}
        </p>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-steel">
          Demo mode: Paystack isn’t wired yet — we stored your hold locally. Table details and venue
          timing will land on WhatsApp for live nights.
        </p>
        <Link href="/nights" className="btn-primary mt-10 inline-flex w-fit">
          Back to nights
        </Link>
      </div>
    </div>
  );
}

export default function BookedPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-steel">Loading…</div>}>
      <BookedInner />
    </Suspense>
  );
}
