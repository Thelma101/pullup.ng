import type { Metadata } from "next";
import { NightsExplorer } from "@/components/NightsExplorer";
import { nights } from "@/lib/nights";

export const metadata: Metadata = {
  title: "Upcoming hangouts",
};

export default function NightsPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Calendar</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl">
          Choose the vibe. We fill the table.
        </h1>
        <p className="mt-5 max-w-2xl text-steel">
          Dinner, drinks, beach, picnic, game nights, brunch. Book your seat and PullUp! Food &amp;
          drinks from ₦15,000 — on you at the venue.
        </p>

        <div className="mt-12">
          <NightsExplorer nights={nights} />
        </div>
      </div>
    </div>
  );
}
