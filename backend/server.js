import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { createDummyUsers } from "./controllers/userController.js";

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.path);
  res.status(404).json({ message: "Route not found", path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true }); // change to { force: true } if you want to reset DB
    console.log("✅ Database connected");

    // Create dummy users if DB is empty
    await createDummyUsers();

    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  } catch (err) {
    console.error("❌ Server start error:", err);
    process.exit(1);
  }
});
