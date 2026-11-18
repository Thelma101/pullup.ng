import type { Metadata } from "next";
import Link from "next/link";
import { CommunityForm } from "@/components/CommunityForm";

export const metadata: Metadata = {
  title: "Join the community",
};

export default function CommunityPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">WhatsApp</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Join the PullUp community.
          </h1>
          <p className="mt-5 max-w-md text-lg text-steel">
            Hangout drops, flash seats, and city vibes. Open to everyone — Lagos, Abuja, or visiting.
          </p>
          <p className="mt-6 text-sm text-steel">
            Want a seat at a table?{" "}
            <Link href="/nights" className="font-semibold text-void underline underline-offset-4">
              Book a hangout
            </Link>
            .
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
          <CommunityForm />
        </div>
      </div>
    </div>
  );
}
