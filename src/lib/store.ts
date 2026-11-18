import { promises as fs } from "fs";
import path from "path";
import type { Booking, Member, PassPurchase, ReconnectOptIn, WaitlistEntry } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : "";
    if (code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson<T>(file: string, value: T) {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  const tmp = `${full}.${process.pid}.tmp`;
  const payload = JSON.stringify(value, null, 2);
  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, full).catch(async () => {
    await fs.writeFile(full, payload, "utf8");
    await fs.unlink(tmp).catch(() => undefined);
  });
}

export async function listMembers() {
  return readJson<Member[]>("members.json", []);
}

export async function saveMember(entry: Member) {
  const list = await listMembers();
  const idx = list.findIndex((m) => m.email.toLowerCase() === entry.email.toLowerCase());
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  await writeJson("members.json", list);
  return entry;
}

export async function findMemberByEmail(email: string) {
  const list = await listMembers();
  return list.find((m) => m.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findMemberByReferralCode(code: string) {
  const list = await listMembers();
  return list.find((m) => m.referralCode.toUpperCase() === code.toUpperCase()) || null;
}

export async function listBookings() {
  return readJson<Booking[]>("bookings.json", []);
}

export async function saveBooking(entry: Booking) {
  const list = await listBookings();
  const idx = list.findIndex((b) => b.id === entry.id || b.ref === entry.ref);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  await writeJson("bookings.json", list);
  return entry;
}

export async function findBookingByRef(ref: string) {
  const list = await listBookings();
  return list.find((b) => b.ref === ref || b.paystackReference === ref) || null;
}

export async function listPasses() {
  return readJson<PassPurchase[]>("passes.json", []);
}

export async function savePass(entry: PassPurchase) {
  const list = await listPasses();
  const idx = list.findIndex((p) => p.id === entry.id || p.paystackReference === entry.paystackReference);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  await writeJson("passes.json", list);
  return entry;
}

export async function findPassByRef(ref: string) {
  const list = await listPasses();
  return list.find((p) => p.id === ref || p.paystackReference === ref) || null;
}

/** @deprecated kept for ops migration of older files */
export async function listApplications() {
  return readJson<Record<string, unknown>[]>("applications.json", []);
}

export async function listWaitlist() {
  return readJson<WaitlistEntry[]>("waitlist.json", []);
}

export async function saveWaitlistEntry(entry: WaitlistEntry) {
  const list = await listWaitlist();
  const idx = list.findIndex(
    (w) => w.nightId === entry.nightId && w.email.toLowerCase() === entry.email.toLowerCase(),
  );
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  await writeJson("waitlist.json", list);
  return entry;
}

export async function listReconnects() {
  return readJson<ReconnectOptIn[]>("reconnects.json", []);
}

export async function saveReconnect(entry: ReconnectOptIn) {
  const list = await listReconnects();
  list.push(entry);
  await writeJson("reconnects.json", list);
  return entry;
}

export async function findMutualReconnects(nightId: string) {
  const list = await listReconnects();
  const forNight = list.filter((r) => r.nightId === nightId);
  const mutual: Array<{ a: string; b: string; labels: string[] }> = [];
  for (const left of forNight) {
    for (const right of forNight) {
      if (left.fromEmail >= right.fromEmail) continue;
      if (
        left.targetLabel.toLowerCase() === right.fromName.toLowerCase() ||
        right.targetLabel.toLowerCase() === left.fromName.toLowerCase()
      ) {
        mutual.push({
          a: left.fromEmail,
          b: right.fromEmail,
          labels: [left.fromName, right.fromName],
        });
      }
    }
  }
  return mutual;
}
