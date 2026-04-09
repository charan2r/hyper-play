const manufacturerOrderService = require("../services/manufacturerOrderService");

// Get all assigned orders for a manufacturer
exports.getAssignedOrders = async (req, res) => {
  try {
    const manufacturerId = req.user?.id || req.user?.manufacturerId;

    if (!manufacturerId) {
      return res.status(401).json({
        error: "Manufacturer ID not found in session",
      });
    }

    const orders =
      await manufacturerOrderService.getAssignedOrders(manufacturerId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch orders",
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
      error: error.message || "Failed to generate PDF",
    });
  }
};
