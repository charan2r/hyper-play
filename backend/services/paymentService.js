const orderRepository = require("../repositories/orderRepository");
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

  
    await orderRepository.updatePaymentStatus(orderId, PAYMENT_STATUS.PAID);

    // Confirm inventory reservation
    await orderRepository.confirmInventory(orderId);

    // Clear customer's cart
    const customerId = session.metadata.customer_id;
    if (customerId) {
      await orderRepository.clearCart(customerId);
    }

    
    return { success: true, orderId };
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

  // Call Webhook
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

  // Verify payment via Stripe session ID
  async verifySession(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      throw new Error("Invalid session ID");
    }

    const orderId = session.metadata.order_id;

    if (!orderId) {
      throw new Error("No order_id found in session");
    }

    // ONLY READ DB
    const order = await orderRepository.getOrderById(orderId);

    return {
      success: true,
      orderId,
      paymentStatus: order.payment_status,
      orderStatus: order.status,
    };
  }
}

module.exports = new PaymentService();
