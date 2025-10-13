const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrderController");

router.get("/orders", adminOrderController.getAllOrders);
router.put(
  "/orders/:orderId/assign-manufacturer",
  adminOrderController.assignManufacturer
);
router.get("/get-manufacturers", adminOrderController.getManufacturers);

module.exports = router;
