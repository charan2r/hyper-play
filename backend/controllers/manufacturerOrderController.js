const manufacturerOrderService = require("../services/manufacturerOrderService");

// Get all assigned orders for the authenticated manufacturer
exports.getAssignedOrders = async (req, res) => {
  try {
    const manufacturerId = req.user?.id;

    if (!manufacturerId) {
      return res.status(401).json({
        error: "Manufacturer ID not found in token",
      });
    }

    const orders = await manufacturerOrderService.getAssignedOrders(manufacturerId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Update manufacturing status 
exports.updateManufacturingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const manufacturerId = req.user?.id;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await manufacturerOrderService.updateManufacturingStatus(
      id,
      status,
      manufacturerId,
      note || null,
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    const isInvalidTransition =
      error.message.includes("transition") ||
      error.message.includes("permitted");
    const statusCode = isNotFound ? 404 : isInvalidTransition ? 422 : 400;
    res.status(statusCode).json({
      error: error.message,
    });
  }
};

// Generate PDF for an order
exports.getDesignPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const pdfBuffer = await manufacturerOrderService.generateOrderPDF(id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=order_${id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      error: error.message,
    });
  }
};
