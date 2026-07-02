const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");
const { verifyToken, requireRole } = require("../middleware/auth");

// All admin order routes require a valid JWT with role === 'admin'
//router.use(verifyToken, requireRole("admin"));

router.get("/orders", adminOrderController.getAllOrders);
router.put(
  "/orders/:orderId/assign-manufacturer",
  adminOrderController.assignManufacturer,
);
router.put("/orders/:orderId/status", adminOrderController.updateOrderStatus);
router.get("/get-manufacturers", adminOrderController.getManufacturers);

module.exports = router;
