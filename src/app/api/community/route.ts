import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type CommunityLead = {
  id: string;
  createdAt: string;
  fullName: string;
  whatsapp: string;
  city: string;
  email?: string;
  source?: string;
};

const file = path.join(process.cwd(), "data", "community.json");

async function readLeads(): Promise<CommunityLead[]> {
  try {
    const raw = await fs.readFile(file, "utf8");
    if (!raw.trim()) return [];
    return JSON.parse(raw) as CommunityLead[];
  } catch {
    return [];
  }
}

async function writeLeads(list: CommunityLead[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const city = String(body.city || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "community").trim();

    if (!fullName || !whatsapp) {
      return NextResponse.json({ error: "Name and WhatsApp are required." }, { status: 400 });
    }
    if (!["lagos", "abuja", "other"].includes(city)) {
      return NextResponse.json({ error: "Choose a city." }, { status: 400 });
    }

    const entry: CommunityLead = {
      id: `com_${Date.now()}`,
      createdAt: new Date().toISOString(),
      fullName,
      whatsapp,
      city,
      email: email || undefined,
      source,
    };

    const list = await readLeads();
    list.push(entry);
    await writeLeads(list);

    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error("[community]", err);
    return NextResponse.json({ error: "Could not submit. Try again." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const key = process.env.OPS_DASHBOARD_SECRET || "pullup-ops";
  const url = new URL(request.url);
  const provided = request.headers.get("x-ops-key") || url.searchParams.get("key") || "";
  if (provided !== key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ leads });
}
