const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyPayment } = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createOrderSchema } = require("../validations/orderValidation");

router.post(
  "/create",
  verifyToken,
  validate(createOrderSchema),
  orderController.createOrder,
);
router.post("/verify-payment", verifyToken, verifyPayment);
router.get("/orders", verifyToken, orderController.getCustomerOrders);
router.get("/orders/:order_id", verifyToken, orderController.getOrder);

module.exports = router;
