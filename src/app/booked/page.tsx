"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { cityLabel, formatLabel, formatNightDate, getNight } from "@/lib/nights";

function BookedInner() {
  const params = useSearchParams();
  const nightId = params.get("night") || "";
  const ref = params.get("ref") || "BR-HOLD";
  const night = getNight(nightId);
  const [community, setCommunity] = useState<"idle" | "yes" | "no">("idle");

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
          Food &amp; drinks on you at the venue. Exact spot by email 24 hours before.
        </p>

        <div className="mt-10 max-w-md rounded-2xl border border-line bg-chalk-hot px-5 py-5">
          <p className="font-display text-xl font-semibold text-void">WhatsApp community?</p>
          <p className="mt-2 text-sm text-steel">
            Hangout drops and flash seats. Optional — your paid seat is already locked.
          </p>
          {community === "idle" ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/community" className="btn-primary text-center sm:flex-1">
                Yes, add me
              </Link>
              <button
                type="button"
                onClick={() => setCommunity("no")}
                className="btn-secondary sm:flex-1"
              >
                No thanks
              </button>
            </div>
          ) : community === "no" ? (
            <p className="mt-4 text-sm text-steel">All good — see you at the table.</p>
          ) : null}
        </div>

        <Link href="/nights" className="btn-secondary mt-8 inline-flex w-fit">
          Back to hangouts
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
