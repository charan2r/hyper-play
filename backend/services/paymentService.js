const orderRepository = require("../repositories/orderRepository");
const adminOrderService = require("./adminOrderService");
const { ORDER_STATUS, PAYMENT_STATUS } = require("./orderState");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async handleCheckoutComplete(session) {
    const orderId = session.metadata.order_id;

    if (!orderId) {
      console.error("No order_id in session metadata");
      return { success: false, error: "Missing order_id" };
    }

    // Only process if payment was successful
    if (session.payment_status !== "paid") {
      return { success: true, orderId, note: "Payment not yet paid" };
    }

    try {
      // Update payment record in payments table with Stripe payment intent ID
      if (session.payment_intent) {
        await orderRepository.updatePaymentByOrderId(
          orderId,
          PAYMENT_STATUS.PAID,
          session.payment_intent,
        );
      }

      // Transition order
      await orderRepository.transitionStatus(
        orderId,
        ORDER_STATUS.PAID,
        "system",
        null,
        "Payment confirmed via Stripe webhook",
      );

      // Update payment status
      await orderRepository.updatePaymentStatus(orderId, PAYMENT_STATUS.PAID);

      // Confirm inventory reservation
      await orderRepository.confirmInventory(orderId);

      // Auto-assign manufacturer 
      try {
        await adminOrderService.autoAssignManufacturer(orderId);
      } catch (assignErr) {
        console.error(
          `Failed to auto-assign order ${orderId}:`,
          assignErr.message,
        );
      }

      // Clear customer's cart
      const customerId = session.metadata.customer_id;
      if (customerId) {
        await orderRepository.clearCart(customerId);
      }
      return { success: true, orderId };
    } catch (error) {
      console.error(`Error processing payment for order ${orderId}:`, error);
      throw error;
    }
  }

  async handlePaymentFailure(event) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.order_id;

    if (orderId) {
      await orderRepository.updatePaymentStatus(orderId, PAYMENT_STATUS.FAILED);
      // Release inventory reservations
      await orderRepository.releaseInventory(orderId);
      // Transition order
      await orderRepository.transitionStatus(
        orderId,
        ORDER_STATUS.CANCELLED,
        "system",
        null,
        "Payment failed via Stripe",
      );
    }

    return { success: true, orderId };
  }


  // Process Stripe webhook events
  async processWebhook(sig, body) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new Error(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
      return await this.handleCheckoutComplete(event.data.object);
    }

    if (event.type === "payment_intent.payment_failed") {
      return await this.handlePaymentFailure(event);
    }

    return { success: true, eventType: event.type };
  }
}

module.exports = new PaymentService();
