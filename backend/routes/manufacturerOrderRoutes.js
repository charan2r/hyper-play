const express = require("express");
const router = express.Router();
const controller = require("../controllers/manufacturerOrderController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get(
  "/orders",
  verifyToken,
  requireRole("manufacturer"),
  controller.getAssignedOrders,
);
router.get(
  "/orders/:id/pdf",
  verifyToken,
  requireRole("manufacturer"),
  controller.getDesignPDF,
);

module.exports = router;
