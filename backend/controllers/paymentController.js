const paymentService = require("../services/paymentService");

// Stripe webhook handler
exports.createWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    const result = await paymentService.processWebhook(sig, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(400).json({
      error: error.message || "Webhook processing failed",
    });
  }
};
