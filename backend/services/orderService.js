const orderRepository = require("../repositories/orderRepository");
const productRepository = require("../repositories/productRepository");
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } = require("./orderState");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class OrderService {
  async createOrder(customerId, cartItems, customerInfo) {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    if (!customerInfo || !customerInfo.firstName || !customerInfo.email) {
      throw new Error("Customer information is required");
    }

    // Create order 
    const order = await orderRepository.create(customerId);
    const orderId = order.id;

    try {
      let total = 0;
      const lineItems = [];

      // Add order items and calculate total
      for (const item of cartItems) {
        const price = await productRepository.getPriceById(item.product_id);
        if (!price) {
          throw new Error(`Product ${item.product_id} not found`);
        }

        total += price * item.quantity;

        await orderRepository.addOrderItem(
          orderId,
          item.product_id,
          item.quantity,
          price,
        );

        // Build Stripe line items
        lineItems.push({
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Product ${item.product_id}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        });
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        client_reference_id: customerId.toString(),
        customer_email: customerInfo.email,
        line_items: lineItems,
        success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        metadata: {
          order_id: orderId,
          customer_id: customerId,
        },
      });

      // Record payment intent in payments table 
      await orderRepository.createPayment(
        orderId,
        total,
        PAYMENT_METHOD.CARD,
        PAYMENT_STATUS.PENDING,
        session.id,
      );

      // Update order with total amount
      await orderRepository.updateTotalAmount(orderId, total);

      return {
        orderId,
        sessionId: session.id,
        redirectUrl: session.url,
        total,
        status: ORDER_STATUS.PENDING_PAYMENT,
      };
    } catch (error) {
      // Transition order to CANCELLED on creation failure
      await orderRepository.transitionStatus(
        orderId,
        ORDER_STATUS.CANCELLED,
        "system",
        null,
        `Order creation failed: ${error.message}`,
      );
      throw error;
    }
  }

  async getCustomerOrders(customerId) {
    return await orderRepository.getCustomerOrders(customerId);
  }

  async getOrderById(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

 
  async updateOrderStatus(orderId, status, role = "system", actorId = null, note = null) {
    return await orderRepository.transitionStatus(orderId, status, role, actorId, note);
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const validStatuses = Object.values(PAYMENT_STATUS);
    if (!validStatuses.includes(paymentStatus)) {
      throw new Error(`Invalid payment status: ${paymentStatus}. Must be one of: ${validStatuses.join(", ")}`);
    }
    return await orderRepository.updatePaymentStatus(orderId, paymentStatus);
  }

  async processPaymentSuccess(orderId) {
    await this.updatePaymentStatus(orderId, PAYMENT_STATUS.SUCCESS);
    return await orderRepository.transitionStatus(
      orderId,
      ORDER_STATUS.PAID,
      "system",
      null,
      "Payment confirmed",
    );
  }
}

module.exports = new OrderService();
