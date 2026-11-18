import type { Metadata } from "next";
import { MemberHome } from "@/components/MemberHome";

export const metadata: Metadata = {
  title: "My PullUp",
};

export default function MePage() {
  return (
    <div className="page-shell pt-[4.25rem]">
      <div className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-clay">Member home</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Your seats, Pass, and past nights.
        </h1>
        <p className="mt-5 text-lg text-steel">
          Enter the email you registered or paid with.
        </p>
        <div className="mt-10">
          <MemberHome />
        </div>
      </div>
    </div>
  );
}
