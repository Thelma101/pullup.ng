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

export async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const error = new Error("Missing MONGODB_URI in environment variables. Please configure MongoDB connection.");
    console.error("[db] Configuration error:", error.message);
    throw error;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("[db] Initiating MongoDB connection...");
    cached.promise = mongoose.connect(uri, { 
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).then((m) => {
      console.log("[db] MongoDB connected successfully");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.error("[db] Connection failed:", err);
    cached.promise = null;
    throw new Error(`MongoDB connection failed: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return cached.conn;
}

export function mongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}
