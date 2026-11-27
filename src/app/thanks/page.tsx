"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ThanksInner() {
  const params = useSearchParams();
  const name = params.get("name") || "friend";
  const city = params.get("city") === "abuja" ? "Abuja" : "Lagos";
  const code = params.get("code") || "";
  const [community, setCommunity] = useState<"idle" | "no">("idle");

  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-20 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">You’re in</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Nice one, {name}.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-steel">
          Your <strong className="text-void">{city}</strong> account is ready. Book a hangout and
          pay your seat — that’s how you meet people.
        </p>
        {code && (
          <p className="mt-6 rounded-xl border border-line bg-chalk-hot px-4 py-3 text-sm">
            Your referral code: <strong className="font-mono text-void">{code}</strong>
            <span className="mt-1 block text-steel">Share it — you both get ₦2,000 credit.</span>
          </p>
        )}

        <div className="mt-10 max-w-md rounded-2xl border border-line bg-chalk-hot px-5 py-5">
          <p className="font-display text-xl font-semibold text-void">WhatsApp community?</p>
          <p className="mt-2 text-sm text-steel">Hangout drops and flash seats. Optional.</p>
          {community === "idle" ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/community" className="btn-primary text-center sm:flex-1">
                Yes, add me
              </Link>
              <button type="button" onClick={() => setCommunity("no")} className="btn-secondary sm:flex-1">
                No thanks
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-steel">All good — book a seat when you’re ready.</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/nights" className="btn-primary text-center">
            Book a hangout
          </Link>
          <Link href="/fee#pass" className="btn-secondary text-center">
            Get a Pass
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
