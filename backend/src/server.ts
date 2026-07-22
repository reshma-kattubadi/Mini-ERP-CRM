import express from "express";
import dotenv from "dotenv";
import pool from "./config/db";
import authRoutes from "./routes/authRoutes";
import { verifyToken } from "./middleware/authMiddleware";
import customerRoutes from "./routes/customerRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);

// Protected Dashboard Route
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to Mini ERP Dashboard",
    user: (req as any).user,
  });
});

const PORT = process.env.PORT || 5000;

// Test database connection when server starts
pool.getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.log("❌ Database connection failed:", error.message);
  });

// Home Route
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT 'Database Connected Successfully!' AS message"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});