const express = require("express");
const router = express.Router();
const controller = require("../controllers/manufacturerOrderController");
const { verifyToken, requireRole } = require("../middleware/auth");

// All manufacturer order routes require a valid JWT with role === 'manufacturer'
router.use(verifyToken, requireRole("manufacturer"));

// Get all orders assigned to this manufacturer
router.get("/orders", controller.getAssignedOrders);

// Update manufacturing status 
router.patch("/orders/:id/status", controller.updateManufacturingStatus);

// Download production PDF for an order
router.get("/orders/:id/pdf", controller.getDesignPDF);

module.exports = router;
