import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();


app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // Add your frontend URLs
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: err.message 
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log(`✅ Database connected`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
});