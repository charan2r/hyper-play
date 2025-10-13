const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/products", customerController.getProducts);
router.post(
  "/design",
  verifyToken,
  requireRole("customer"),
  customerController.addDesign
);
router.get(
  "/design",
  verifyToken,
  requireRole("customer"),
  customerController.getDesign
);
router.get(
  "/cart",
  verifyToken,
  requireRole("customer"),
  customerController.getCart
);
router.post(
  "/cart",
  verifyToken,
  requireRole("customer"),
  customerController.addToCart
);

module.exports = router;
