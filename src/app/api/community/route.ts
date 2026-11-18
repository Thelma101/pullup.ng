import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isNigeriaState } from "@/lib/nigeria-states";

type CommunityLead = {
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
  /** @deprecated kept for older leads */
  city?: string;
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
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const ageRaw = String(body.age || "").trim();
    const state = String(body.state || "").trim();
    const area = String(body.area || "").trim();
    const aboutYou = String(body.aboutYou || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "community").trim();

    const age = Number.parseInt(ageRaw, 10);

    if (!firstName || !lastName || !whatsapp) {
      return NextResponse.json({ error: "Name and WhatsApp are required." }, { status: 400 });
    }
    if (!Number.isFinite(age) || age < 18 || age > 99) {
      return NextResponse.json({ error: "Enter a valid age (18+)." }, { status: 400 });
    }
    if (!isNigeriaState(state)) {
      return NextResponse.json({ error: "Choose a valid state." }, { status: 400 });
    }
    if (!area) {
      return NextResponse.json({ error: "Tell us where you live." }, { status: 400 });
    }
    if (!aboutYou) {
      return NextResponse.json({ error: "Share 3 things we should know about you." }, { status: 400 });
    }

    const entry: CommunityLead = {
      id: `com_${Date.now()}`,
      createdAt: new Date().toISOString(),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      age,
      state,
      area,
      aboutYou,
      whatsapp,
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
