import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

function uriLooksPlaceholder(uri: string) {
  return /<db_password>|PASSWORD|YOUR_|xxx/i.test(uri);
}

export function mongoConfigured() {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && !uriLooksPlaceholder(uri));
}

export function mongoConfigIssue(): string | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return "Missing MONGODB_URI";
  if (uriLooksPlaceholder(uri)) {
    return "MONGODB_URI still has a password placeholder — paste the real Atlas password";
  }
  if (!/\/[^/?]+(\?|$)/.test(uri.replace(/^mongodb(\+srv)?:\/\//, ""))) {
    return "MONGODB_URI should include a database name (e.g. /pullup)";
  }
  return null;
}

export async function dbConnect() {
  const issue = mongoConfigIssue();
  if (issue) throw new Error(issue);

  const uri = process.env.MONGODB_URI!;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8_000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export async function mongoPing(): Promise<{ ok: boolean; detail?: string }> {
  const issue = mongoConfigIssue();
  if (issue) return { ok: false, detail: issue };
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) return { ok: false, detail: "Connected but no database handle" };
    await db.admin().command({ ping: 1 });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/IP|whitelist|access list/i.test(msg)) {
      return {
        ok: false,
        detail:
          "Atlas Network Access is blocking this host — add 0.0.0.0/0 (needed for Vercel)",
      };
    }
    if (/auth|bad auth|Authentication failed/i.test(msg)) {
      return { ok: false, detail: "Mongo auth failed — check username/password in MONGODB_URI" };
    }
    return { ok: false, detail: msg.slice(0, 200) };
  }
}
