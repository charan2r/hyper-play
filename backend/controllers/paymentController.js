const pool = require("../db/pool");

exports.payHereNotify = async (req, res) => {
  const {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    status_code,
    md5sig,
    method,
  } = req.body;

  try {
    if (status_code != 2) {
      console.log("Payment failed:", req.body);
      return res.status(200).send("Payment Failed");
    }

    // insert into payments table
    await pool.query(
      `insert into payments (order_id, amount, method, status, transaction_id, gateway, confirmed) values ($1, $2, $3, 'success', $4, 'payhere', true)`,
      [order_id, payhere_amount, method, payment_id]
    );

    // update orders table
    await pool.query(
      `update orders set status ='paid', payment_status = 'completed' where id = $1`,
      [order_id]
    );

    // update products
    const items = await pool.query(
      `select product_id, quantity from order_items where id = $1`,
      [order_id]
    );

    for (const item of items.row) {
      await pool.query(
        `update product set stock = stock - $1, sold = sold + $1 where order_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("PayHere Notify Error:", error);
    res.status(500).send("Error");
  }
};
