import type { PassPlan } from "./types";

export const REFERRAL_CREDIT_NAIRA = 2000;

export const PASS_PLANS: Record<
  PassPlan,
  { label: string; credits: number; amountNaira: number; blurb: string; saveNaira: number }
> = {
  pass_3: {
    label: "3 hangouts / month",
    credits: 3,
    amountNaira: 20000,
    saveNaira: 10000,
    blurb: "Save ~₦10k vs booking one-by-one.",
  },
  pass_5: {
    label: "5 hangouts / month",
    credits: 5,
    amountNaira: 35000,
    saveNaira: 15000,
    blurb: "Save ~₦15k. Best if you Pull Up often.",
  },
};

export function makeReferralCode(name: string) {
  const base = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 4)
    .toUpperCase();
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PU${base || "UP"}${tail}`;
}
