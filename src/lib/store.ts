import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T) {
  await ensureDataDir();
  const full = path.join(dataDir, file);
  await fs.writeFile(full, JSON.stringify(value, null, 2), "utf8");
}

export async function saveApplication(entry: Record<string, unknown>) {
  const list = await readJson<Record<string, unknown>[]>("applications.json", []);
  list.push(entry);
  await writeJson("applications.json", list);
  return entry;
}

export async function saveBooking(entry: Record<string, unknown>) {
  const list = await readJson<Record<string, unknown>[]>("bookings.json", []);
  list.push(entry);
  await writeJson("bookings.json", list);
  return entry;
}
