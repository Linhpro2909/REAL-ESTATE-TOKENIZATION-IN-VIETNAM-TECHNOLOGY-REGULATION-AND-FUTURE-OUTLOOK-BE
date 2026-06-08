require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const simulatorRouter = require("./routes/simulator");
const legalRouter = require("./routes/legal");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ── Rate limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/simulator", simulatorRouter);
app.use("/api/legal", legalRouter);
app.use("/api/chat", chatRouter);

// ── Health check ──────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RE Tokenization AI Agent",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🏙️  RE Tokenization AI Agent Backend`);
  console.log(`🚀  Running on http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/health\n`);
});

module.exports = app;
