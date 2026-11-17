import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";

export const metadata: Metadata = {
  title: "Request an invite",
  description: "Apply to PullUp.ng — invite-only dinners in Lagos and Abuja.",
};

export default function ApplyPage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8 md:py-20">
        <div className="md:pt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">
            Invite only
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-void md:text-5xl">
            Tell us who you are.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-steel">
            We read every application. If it fits, we verify you on WhatsApp and send your city
            group — Lagos or Abuja.
          </p>

          <div className="mt-10 space-y-5 border-l-2 border-signal pl-5">
            {[
              "Ages 21 and up",
              "Separate WhatsApp groups per city",
              "Dinner seats paid separately after you’re in",
            ].map((line) => (
              <p key={line} className="text-sm font-medium text-void-soft">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-chalk-hot p-5 md:p-8">
          <ApplyForm />
        </div>
      </div>
    </div>
  );
}
