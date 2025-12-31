const pool = require("../db");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const order_id = paymentIntent.metadata.order_id;

      // update payments table with successful payment
      await pool.query(
        `update payments set status = 'paid', stripe_charge_id = $1, updated_at = CURRENT_TIMESTAMP where order_id = $2`,
        [paymentIntent.charges.data[0].id, order_id]
      );

      // update orders table
      await pool.query(
        `update orders set status = 'processing', payment_status = 'paid' where id = $1`,
        [order_id]
      );

      // update products
      const items = await pool.query(
        `select product_id, quantity from order_items where order_id = $1`,
        [order_id]
      );

      for (const item of items.rows) {
        await pool.query(
          `update product set stock = stock - $1, sold = sold + $1 where id = $2`,
          [item.quantity, item.product_id]
        );
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      await pool.query(
        `UPDATE payments SET status = 'failed' WHERE stripe_payment_intent_id = $1`,
        [paymentIntent.id]
      );

      await pool.query(
        `UPDATE orders SET payment_status = 'failed' WHERE id = $1`,
        [paymentIntent.metadata.order_id]
      );
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Error");
  }
};
