const orderRepository = require("../repositories/orderRepository");
const notificationOutboxRepository = require("../repositories/notificationOutboxRepository");
const { ORDER_STATUS, PAYMENT_STATUS } = require("./orderState");
const {
  NOTIFICATION_EVENT_TYPES,
  NOTIFICATION_SCHEMA_VERSION,
} = require("@hyper-play/notification-contract");
const { randomUUID } = require("node:crypto");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async handleCheckoutComplete(event) {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in session metadata");
      return { success: false, error: "Missing order_id" };
    }

    // Only process if payment was successful
    if (session.payment_status !== "paid") {
      return { success: true, orderId, note: "Payment not yet paid" };
    }

    try {
      return await orderRepository.withTransaction(async (client) => {
        const claimed = await orderRepository.claimStripeWebhookEvent(
          event.id,
          event.type,
          client,
        );
        if (!claimed) {
          return { success: true, orderId, duplicate: true };
        }

        const payment = await orderRepository.updatePaymentByOrderId(
          orderId,
          PAYMENT_STATUS.PAID,
          session.payment_intent,
          client,
        );
        if (!payment) {
          throw new Error(`Payment record for order ${orderId} not found`);
        }

        await orderRepository.transitionStatus(
          orderId,
          ORDER_STATUS.PAID,
          "system",
          null,
          "Payment confirmed via Stripe webhook",
          client,
        );
        await orderRepository.updatePaymentStatus(
          orderId,
          PAYMENT_STATUS.PAID,
          client,
        );
        await orderRepository.confirmInventory(orderId, client);

        const manufacturer =
          await orderRepository.findAvailableManufacturer(client);
        if (manufacturer) {
          await orderRepository.createManufacturingAssignment(
            orderId,
            manufacturer.id,
            client,
          );
          await orderRepository.transitionStatus(
            orderId,
            ORDER_STATUS.ASSIGNED,
            "system",
            null,
            `Auto-assigned to manufacturer: ${manufacturer.name}`,
            client,
          );
        }

        const customerId = session.metadata?.customer_id;
        if (customerId) {
          await orderRepository.clearCart(customerId, client);
        }

        const snapshot = await orderRepository.getNotificationOrderSnapshot(
          orderId,
          client,
        );
        if (!snapshot) {
          throw new Error(`Notification snapshot for order ${orderId} not found`);
        }

        const notificationEvent = {
          schemaVersion: NOTIFICATION_SCHEMA_VERSION,
          eventId: randomUUID(),
          eventType: NOTIFICATION_EVENT_TYPES.PAYMENT_SUCCEEDED,
          occurredAt: new Date().toISOString(),
          recipient: {
            email: snapshot.customer_email,
            name: snapshot.customer_name,
          },
          order: {
            id: snapshot.id,
            total: Number(snapshot.total_amount),
            currency: "LKR",
            status: snapshot.status,
          },
        };
        await notificationOutboxRepository.create(notificationEvent, client);

        return {
          success: true,
          orderId,
          manufacturerId: manufacturer?.id || null,
          notificationEventId: notificationEvent.eventId,
        };
      });
    } catch (error) {
      console.error(`Error processing payment for order ${orderId}:`, error);
      throw error;
    }
  }

  async handlePaymentFailure(event) {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.order_id;

    if (!orderId) {
      return { success: true, orderId: null, note: "Missing order_id" };
    }

    return orderRepository.withTransaction(async (client) => {
      const claimed = await orderRepository.claimStripeWebhookEvent(
        event.id,
        event.type,
        client,
      );
      if (!claimed) {
        return { success: true, orderId, duplicate: true };
      }

      const payment = await orderRepository.updatePaymentByOrderId(
        orderId,
        PAYMENT_STATUS.FAILED,
        paymentIntent.id,
        client,
      );
      if (!payment) {
        throw new Error(`Payment record for order ${orderId} not found`);
      }
      await orderRepository.updatePaymentStatus(
        orderId,
        PAYMENT_STATUS.FAILED,
        client,
      );
      await orderRepository.releaseInventory(orderId, client);
      await orderRepository.transitionStatus(
        orderId,
        ORDER_STATUS.CANCELLED,
        "system",
        null,
        "Payment failed via Stripe",
        client,
      );

      return { success: true, orderId };
    });
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
      return await this.handleCheckoutComplete(event);
    }

    if (event.type === "payment_intent.payment_failed") {
      return await this.handlePaymentFailure(event);
    }

    return { success: true, eventType: event.type };
  }
}

module.exports = new PaymentService();
