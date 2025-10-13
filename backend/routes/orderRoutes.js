const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/create", orderController.createOrder);
router.get("/orders", orderController.getCustomerOrders);
router.get("/orders/:order_id", orderController.getOrder);

module.exports = router;
