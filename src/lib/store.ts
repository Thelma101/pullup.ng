import { dbConnect } from "./db";
import {
  BookingModel,
  CommunityModel,
  MemberModel,
  PassModel,
  ReconnectModel,
  WaitlistModel,
  type CommunityLead,
} from "./models";
import type { Booking, Member, PassPurchase, ReconnectRequest, WaitlistEntry } from "./types";

function stripId<T>(doc: unknown): T | null {
  if (!doc || typeof doc !== "object") return null;
  const { _id: _unused, __v: _v, ...rest } = doc as Record<string, unknown>;
  return rest as T;
}

async function ready() {
  await dbConnect();
}

export async function listMembers(): Promise<Member[]> {
  await ready();
  const rows = await MemberModel.find({}).lean();
  return rows.map((r) => stripId<Member>(r)!);
}

export async function saveMember(entry: Member) {
  await ready();
  await MemberModel.findOneAndUpdate(
    { email: entry.email.toLowerCase() },
    { ...entry, email: entry.email.toLowerCase() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return entry;
}

export async function findMemberByEmail(email: string) {
  await ready();
  const row = await MemberModel.findOne({ email: email.toLowerCase() }).lean();
  return stripId<Member>(row);
}

export async function findMemberByReferralCode(code: string) {
  await ready();
  const row = await MemberModel.findOne({
    referralCode: { $regex: new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  }).lean();
  return stripId<Member>(row);
}

export async function listBookings(): Promise<Booking[]> {
  await ready();
  const rows = await BookingModel.find({}).lean();
  return rows.map((r) => stripId<Booking>(r)!);
}

export async function saveBooking(entry: Booking) {
  await ready();
  await BookingModel.findOneAndUpdate({ id: entry.id }, entry, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  return entry;
}

export async function findBookingByRef(ref: string) {
  await ready();
  const row = await BookingModel.findOne({
    $or: [{ ref }, { paystackReference: ref }],
  }).lean();
  return stripId<Booking>(row);
}

export async function listPasses(): Promise<PassPurchase[]> {
  await ready();
  const rows = await PassModel.find({}).lean();
  return rows.map((r) => stripId<PassPurchase>(r)!);
}

export async function savePass(entry: PassPurchase) {
  await ready();
  await PassModel.findOneAndUpdate({ id: entry.id }, entry, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  return entry;
}

export async function findPassByRef(ref: string) {
  await ready();
  const row = await PassModel.findOne({
    $or: [{ id: ref }, { paystackReference: ref }],
  }).lean();
  return stripId<PassPurchase>(row);
}

export async function listApplications() {
  return [] as Record<string, unknown>[];
}

export async function listWaitlist(): Promise<WaitlistEntry[]> {
  await ready();
  const rows = await WaitlistModel.find({}).lean();
  return rows.map((r) => stripId<WaitlistEntry>(r)!);
}

export async function saveWaitlistEntry(entry: WaitlistEntry) {
  await ready();
  await WaitlistModel.findOneAndUpdate(
    { nightId: entry.nightId, email: entry.email.toLowerCase() },
    { ...entry, email: entry.email.toLowerCase() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return entry;
}

export async function listReconnects(): Promise<ReconnectRequest[]> {
  await ready();
  const rows = await ReconnectModel.find({}).lean();
  return rows.map((r) => stripId<ReconnectRequest>(r)!);
}

export async function saveReconnect(entry: ReconnectRequest) {
  await ready();
  await ReconnectModel.findOneAndUpdate({ id: entry.id }, entry, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  return entry;
}

export async function findReconnectByToken(token: string) {
  await ready();
  const row = await ReconnectModel.findOne({ token }).lean();
  return stripId<ReconnectRequest>(row);
}

export async function listCommunity(): Promise<CommunityLead[]> {
  await ready();
  const rows = await CommunityModel.find({}).sort({ createdAt: -1 }).lean();
  return rows.map((r) => stripId<CommunityLead>(r)!);
}

export async function saveCommunityLead(entry: CommunityLead) {
  await ready();
  await CommunityModel.findOneAndUpdate({ id: entry.id }, entry, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  return entry;
}

export async function findTablemates(nightId: string, excludeEmail: string) {
  const bookings = await listBookings();
  return bookings
    .filter(
      (b) =>
        b.nightId === nightId &&
        b.paymentStatus === "paid" &&
        b.email.toLowerCase() !== excludeEmail.toLowerCase(),
    )
    .map((b) => ({
      fullName: b.fullName,
      email: b.email,
      firstName: b.fullName.trim().split(/\s+/)[0] || b.fullName,
    }));
}

export type { CommunityLead };
