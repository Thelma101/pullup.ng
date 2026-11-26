import { Schema, models, model } from "mongoose";
import type {
  Booking,
  Member,
  PassPurchase,
  ReconnectRequest,
  WaitlistEntry,
} from "./types";

export type CommunityLead = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  state: string;
  area: string;
  aboutYou: string;
  whatsapp: string;
  email?: string;
  source?: string;
  city?: string;
};

const memberSchema = new Schema<Member>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    reason: { type: String, required: true },
    tablePreference: { type: String, required: true },
    dietary: String,
    howFound: String,
    referralCode: { type: String, required: true, unique: true },
    referredBy: String,
    creditNaira: { type: Number, default: 0 },
    passCredits: { type: Number, default: 0 },
    passPlan: { type: String, default: null },
    status: { type: String, default: "active" },
  },
  { collection: "members" },
);

const bookingSchema = new Schema<Booking>(
  {
    id: { type: String, required: true, unique: true },
    ref: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    nightId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    tablePreference: { type: String, required: true },
    dietary: String,
    budgetBand: { type: String, required: true },
    feeNaira: { type: Number, required: true },
    amountPaidNaira: { type: Number, required: true },
    creditAppliedNaira: { type: Number, default: 0 },
    paidWith: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paystackReference: String,
    referralCodeUsed: String,
  },
  { collection: "bookings" },
);

const passSchema = new Schema<PassPurchase>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    fullName: { type: String, required: true },
    plan: { type: String, required: true },
    amountNaira: { type: Number, required: true },
    credits: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paystackReference: String,
    referralCodeUsed: String,
  },
  { collection: "passes" },
);

const waitlistSchema = new Schema<WaitlistEntry>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    nightId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    status: { type: String, required: true },
  },
  { collection: "waitlist" },
);

const reconnectSchema = new Schema<ReconnectRequest>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    bookingRef: { type: String, required: true },
    nightId: { type: String, required: true },
    fromEmail: { type: String, required: true, lowercase: true },
    fromName: { type: String, required: true },
    targetLabel: { type: String, required: true },
    targetEmail: String,
    note: String,
    status: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    respondedAt: String,
  },
  { collection: "reconnects" },
);

const communitySchema = new Schema<CommunityLead>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    state: { type: String, required: true },
    area: { type: String, required: true },
    aboutYou: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: String,
    source: String,
    city: String,
  },
  { collection: "community" },
);

export const MemberModel = models.Member || model<Member>("Member", memberSchema);
export const BookingModel = models.Booking || model<Booking>("Booking", bookingSchema);
export const PassModel = models.Pass || model<PassPurchase>("Pass", passSchema);
export const WaitlistModel = models.Waitlist || model<WaitlistEntry>("Waitlist", waitlistSchema);
export const ReconnectModel = models.Reconnect || model<ReconnectRequest>("Reconnect", reconnectSchema);
export const CommunityModel = models.Community || model<CommunityLead>("Community", communitySchema);
