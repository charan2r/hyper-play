const express = require("express");
const router = express.Router();
const controller = require("../controllers/manufacturerOrderController");

router.get("/orders", controller.getAssignedOrders);
router.get("/orders/:id/pdf", controller.getDesignPDF);

module.exports = router;
