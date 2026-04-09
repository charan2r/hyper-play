const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createOrderSchema } = require("../validations/orderValidation");

router.post(
  "/create",
  verifyToken,
  validate(createOrderSchema),
  orderController.createOrder,
);
router.get("/orders", verifyToken, orderController.getCustomerOrders);
router.get("/orders/:order_id", verifyToken, orderController.getOrder);

module.exports = router;
