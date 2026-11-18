export type City = "lagos" | "abuja";

export type TablePreference = "mixed" | "women-only" | "men-only";

export type NightFormat =
  | "dinner"
  | "drinks"
  | "beach"
  | "picnic"
  | "games"
  | "brunch";

export type PassPlan = "pass_3" | "pass_5";

export interface Night {
  id: string;
  city: City;
  area: string;
  format: NightFormat;
  date: string;
  time: string;
  seatsTotal: number;
  seatsTaken: number;
  feeNaira: number;
  minSpendNaira: number;
  status: "open" | "filling" | "full" | "flash";
}

export interface Member {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  age: number;
  city: City;
  area: string;
  reason: string;
  tablePreference: TablePreference;
  dietary?: string;
  howFound?: string;
  referralCode: string;
  referredBy?: string;
  creditNaira: number;
  passCredits: number;
  passPlan?: PassPlan | null;
  status: "active" | "removed";
}

export interface Booking {
  id: string;
  ref: string;
  createdAt: string;
  nightId: string;
  fullName: string;
  email: string;
  tablePreference: TablePreference;
  dietary?: string;
  budgetBand: "moderate" | "comfortable" | "open";
  feeNaira: number;
  amountPaidNaira: number;
  creditAppliedNaira: number;
  paidWith: "paystack" | "pass" | "mixed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "no_show";
  paystackReference?: string;
  referralCodeUsed?: string;
}

export interface PassPurchase {
  id: string;
  createdAt: string;
  email: string;
  fullName: string;
  plan: PassPlan;
  amountNaira: number;
  credits: number;
  paymentStatus: "pending" | "paid" | "failed";
  paystackReference?: string;
  referralCodeUsed?: string;
}

export interface WaitlistEntry {
  id: string;
  createdAt: string;
  nightId: string;
  fullName: string;
  email: string;
  status: "waiting" | "offered" | "booked" | "expired";
}

export interface ReconnectOptIn {
  id: string;
  createdAt: string;
  bookingRef: string;
  nightId: string;
  fromEmail: string;
  fromName: string;
  targetLabel: string;
  note?: string;
}

export interface ApplicationPayload {
  fullName: string;
  age: number;
  email: string;
  city: City;
  area: string;
  reason: string;
  tablePreference: TablePreference;
  dietary?: string;
  howFound?: string;
  referralCode?: string;
}
