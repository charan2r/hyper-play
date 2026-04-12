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

// Verify payment via Stripe session (redirect-based flow)
exports.verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const result = await paymentService.verifySession(sessionId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      error: error.message || "Payment verification failed",
    });
  }
};
