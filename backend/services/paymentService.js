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
        PAYMENT_STATUS.SUCCESS,
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

  
    await orderRepository.updatePaymentStatus(orderId, PAYMENT_STATUS.SUCCESS);

    // Update product stock 
    const items = await orderRepository.getOrderItems(orderId);
    for (const item of items) {
      await orderRepository.updateProductStock(item.product_id, item.quantity);
    }

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

    console.log(`Stripe webhook received: ${event.type}`);

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

    // Check if already processed
    const order = await orderRepository.getOrderById(orderId);
    if (order && order.payment_status === PAYMENT_STATUS.SUCCESS) {
      return { success: true, orderId, alreadyProcessed: true };
    }

    // Process the payment confirmation
    if (session.payment_status === "paid") {
      if (session.payment_intent) {
        await orderRepository.updatePaymentByOrderId(
          orderId,
          PAYMENT_STATUS.SUCCESS,
          session.payment_intent,
        );
      }

      // Transition order
      await orderRepository.transitionStatus(
        orderId,
        ORDER_STATUS.PAID,
        "system",
        null,
        "Payment confirmed via session verify",
      );

      await orderRepository.updatePaymentStatus(orderId, PAYMENT_STATUS.SUCCESS);

      // Update product stock
      const items = await orderRepository.getOrderItems(orderId);
      for (const item of items) {
        await orderRepository.updateProductStock(item.product_id, item.quantity);
      }

      // Clear customer's cart
      const customerId = session.metadata.customer_id;
      if (customerId) {
        await orderRepository.clearCart(customerId);
      }

      return { success: true, orderId };
    }

    return {
      success: false,
      orderId,
      paymentStatus: session.payment_status,
    };
  }
}

module.exports = new PaymentService();
