const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  loginManufacturer,
} = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");
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

// Manufacturer
router.post(
  "/manufacturer/login",
  authLimiter,
  validate(loginSchema),
  loginManufacturer,
);

module.exports = router;
