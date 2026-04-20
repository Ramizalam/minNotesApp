const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Track whether the initial DB connection attempt has settled.
let dbReady = false;
let dbError = null;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Graceful degradation — return 503 on DB-dependent routes when MongoDB is down.
const requireDb = (req, res, next) => {
  const state = mongoose.connection.readyState; // 1 = connected
  if (state !== 1) {
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable — database is not connected. Please try again shortly.",
      dbState: ["disconnected", "connected", "connecting", "disconnecting"][state] ?? "unknown",
    });
  }
  next();
};

// Routes (guarded so the server stays up even without a DB connection)
app.use("/api/auth", requireDb, authRoutes);
app.use("/api/notes", requireDb, noteRoutes);

// Health check — always responds, reports real DB state
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  const stateLabel = ["disconnected", "connected", "connecting", "disconnecting"][state] ?? "unknown";
  const isHealthy = state === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "OK" : "DEGRADED",
    timestamp: new Date().toISOString(),
    db: {
      state: stateLabel,
      connected: isHealthy,
      ...(dbError && !isHealthy ? { lastError: dbError } : {}),
    },
  });
});

// Start the HTTP server immediately — do not wait for MongoDB.
// This ensures Railway's health checks pass and the service is reachable
// for debugging even when the database is temporarily unavailable.
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Attempt to connect to MongoDB with a 30-second overall startup timeout.
// If the timeout fires first we log a warning but keep the server running.
const DB_STARTUP_TIMEOUT_MS = 30_000;

const startupTimer = setTimeout(() => {
  if (!dbReady) {
    console.warn(
      "⚠️  MongoDB did not connect within 30 s of startup. " +
      "The server is running but DB-dependent endpoints will return 503 until the connection is established. " +
      "Check MONGODB_URI, firewall rules, and IP whitelists."
    );
  }
}, DB_STARTUP_TIMEOUT_MS);

// Don't let this timer keep the process alive on its own.
startupTimer.unref();

connectDB()
  .then(() => {
    dbReady = true;
    console.log("🟢 Database connection established — all endpoints are now fully operational.");
  })
  .catch((err) => {
    dbReady = true; // settled (with failure)
    dbError = err.message;
    console.error(
      "🔴 Could not connect to MongoDB after all retries. " +
      "The server will continue running. DB-dependent endpoints will return 503. " +
      "Fix the underlying issue (IP whitelist, credentials, network) and redeploy."
    );
  });
