const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const manufacturerOrderRoutes = require("./routes/manufacturerOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const API_VERSION = "v1";

// CORS Configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Payment route (raw body for Stripe webhooks)
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Apply general API limiter to all API routes
app.use("/api", apiLimiter);

// API Routes with versioning
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminProductRoutes);
apiRouter.use("/admin", adminOrderRoutes);
apiRouter.use("/manufacturer", manufacturerOrderRoutes);
apiRouter.use("/order", orderRoutes);
apiRouter.use("/customer", customerRoutes);

app.use(`/api/${API_VERSION}`, apiRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
  console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(" Uncaught Exception:", error);
  process.exit(1);
});
