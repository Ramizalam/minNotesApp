const mongoose = require("mongoose");

// Strip credentials from a MongoDB URI for safe logging.
// mongodb+srv://user:pass@host/db  →  mongodb+srv://<credentials>@host/db
const sanitizeUri = (uri) => {
  if (!uri) return "(MONGODB_URI is not set)";
  try {
    return uri.replace(/:\/\/[^@]+@/, "://<credentials>@");
  } catch {
    return "(unable to parse URI)";
  }
};

// Categorise a Mongoose/MongoDB connection error into a human-readable hint
// so the logs immediately point at the likely root cause.
const classifyError = (error) => {
  const msg = error.message || "";
  const code = error.code || (error.cause && error.cause.code) || "";

  if (msg.includes("ECONNREFUSED"))
    return "ECONNREFUSED — nothing is listening at that host/port. Check the URI host and port, and that the MongoDB service is running.";
  if (msg.includes("ENOTFOUND") || msg.includes("ECONNRESET"))
    return `${code || "DNS/network error"} — hostname could not be resolved. Verify the URI hostname and that DNS is reachable from this Railway region.`;
  if (msg.includes("timed out") || msg.includes("ETIMEDOUT") || code === "ETIMEDOUT")
    return "ETIMEDOUT — connection attempt timed out. The host is likely unreachable (firewall, IP whitelist, wrong region). Check that this Railway service's outbound IPs are whitelisted in your MongoDB provider.";
  if (msg.includes("Authentication failed") || msg.includes("auth"))
    return "Authentication failed — double-check the username and password in MONGODB_URI.";
  if (msg.includes("SSL") || msg.includes("TLS"))
    return "TLS/SSL error — the server may require (or reject) TLS. Check the `tls` / `ssl` options in your URI.";
  return `Unexpected error (${error.name || "Error"}): ${msg}`;
};

const INITIAL_RETRY_DELAY_MS = 2_000;
const MAX_RETRY_DELAY_MS = 30_000;
const MAX_ATTEMPTS = 5;

const connectDB = async ({ attempt = 1 } = {}) => {
  const uri = process.env.MONGODB_URI;

  if (attempt === 1) {
    console.log(`🔌 Connecting to MongoDB: ${sanitizeUri(uri)}`);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000, // fail fast if the server is unreachable
      connectTimeoutMS: 10_000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host} (attempt ${attempt})`);
  } catch (error) {
    const hint = classifyError(error);
    console.error(`❌ MongoDB connection failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${hint}`);

    if (attempt >= MAX_ATTEMPTS) {
      console.error("💀 All MongoDB connection attempts exhausted. Giving up.");
      // Throw so the caller (server.js) can decide what to do next.
      throw error;
    }

    // Exponential backoff: 2 s, 4 s, 8 s, 16 s … capped at 30 s.
    const delay = Math.min(INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
    console.log(`⏳ Retrying in ${delay / 1000}s…`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectDB({ attempt: attempt + 1 });
  }
};

module.exports = connectDB;
