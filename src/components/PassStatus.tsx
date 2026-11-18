"use client";

import { useSearchParams } from "next/navigation";

export function PassStatus() {
  const params = useSearchParams();
  const pay = params.get("pay");
  const ref = params.get("ref");

  if (pay === "success") {
    return (
      <p className="mt-8 rounded-xl border border-signal/40 bg-signal/15 px-4 py-3 text-sm font-medium text-void">
        Pass paid{ref ? ` · ${ref}` : ""}. Use a credit when you book your next hangout.
      </p>
    );
  }

  if (pay === "failed") {
    return (
      <p className="mt-8 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-sm text-clay">
        Payment didn’t go through. Try again.
      </p>
    );
  }

  return null;
}
