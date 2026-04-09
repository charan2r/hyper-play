const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { apiLimiter } = require("./middleware/rateLimiter");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const manufacturerOrderRoutes = require("./routes/manufacturerOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.post("/api/payments", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// Apply general API limiter to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api", authRoutes); // Auth routes are wrapped with specific limiters inside
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/manufacturer", manufacturerOrderRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/customer", customerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
