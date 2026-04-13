const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  loginManufacturer,
  getAdminProfile,
} = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");
const { verifyToken, requireRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerCustomerSchema,
  loginSchema,
} = require("../validations/authValidation");

// Customer
router.post(
  "/register",
  authLimiter,
  validate(registerCustomerSchema),
  registerCustomer,
);
router.post("/login", authLimiter, validate(loginSchema), loginCustomer);

// Admin
router.post("/admin/login", authLimiter, validate(loginSchema), loginAdmin);
router.get(
  "/admin/profile",
  verifyToken,
  requireRole("admin"),
  getAdminProfile,
);

// Manufacturer
router.post(
  "/manufacturer/login",
  authLimiter,
  validate(loginSchema),
  loginManufacturer,
);

module.exports = router;
