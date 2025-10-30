const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ================================
// Middleware
// ================================

// Allow JSON body parsing
app.use(express.json());

// Allow URL-encoded data (e.g., forms)
app.use(express.urlencoded({ extended: true }));

// Parse cookies (⚠️ REQUIRED for JWT cookie auth)
app.use(cookieParser());

// Configure CORS properly
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies to be sent across domains
  })
);

// ================================
// Routes
// ================================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/career", require("./routes/career"));
app.use("/api/mentor", require("./routes/mentor"));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "HerApt Backend Running",
  });
});

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
