import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join PullUp.ng — invite-only hangouts in Lagos and Abuja.",
};

export default function ApplyPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8 md:py-20">
        <div className="md:pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Register</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-void md:text-5xl">
            Create your PullUp account.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-steel">
            Add your email, then book and pay for hangouts.
          </p>
          <div className="mt-10 space-y-5 border-l-2 border-signal pl-5 text-sm text-void-soft">
            <p>Ages 21+</p>
            <p>Food &amp; drinks from ₦15,000 — on you at the venue</p>
            <p>Exact venue drops 24 hours before</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
          <ApplyForm />
        </div>
      </div>
    </div>
  );
}
