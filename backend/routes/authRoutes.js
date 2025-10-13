const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  loginManufacturer,
} = require("../controllers/authController");

// Customer
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Admin
router.post("/admin/login", loginAdmin);

// Manufacturer
router.post("/manufacturer/login", loginManufacturer);

module.exports = router;
