const orderRepository = require("../repositories/orderRepository");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async handlePaymentSuccess(event) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.order_id;

    // Update payment record
    await orderRepository.updatePaymentRecord(
      paymentIntent.charges.data[0].id,
      paymentIntent.id,
    );

    // Update order status to processing
    await orderRepository.updateOrderStatus(orderId, "processing");
    await orderRepository.updatePaymentStatus(orderId, "paid");

    // Update product stock
    const items = await orderRepository.getOrderItems(orderId);
    for (const item of items) {
      await orderRepository.updateProductStock(item.product_id, item.quantity);
    }

    return { success: true, orderId };
  }

  async handlePaymentFailure(event) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.order_id;

    // Update payment status to failed
    await orderRepository.updatePaymentStatus(orderId, "failed");

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

    if (event.type === "payment_intent.succeeded") {
      return await this.handlePaymentSuccess(event);
    }

    if (event.type === "payment_intent.payment_failed") {
      return await this.handlePaymentFailure(event);
    }

    return { success: true, eventType: event.type };
  }
}

module.exports = new PaymentService();
