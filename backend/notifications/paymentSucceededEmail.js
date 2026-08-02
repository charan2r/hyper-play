function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatStatus(status) {
  return status.toLowerCase().replaceAll("_", " ");
}

function createPaymentSucceededEmail(event) {
  const customerName = event.recipient.name || "Customer";
  const amount = formatAmount(event.order.total, event.order.currency);
  const status = formatStatus(event.order.status);

  return {
    subject: `Payment confirmed for Hyper Play order #${event.order.id}`,
    text: [
      `Hi ${customerName},`,
      "",
      `We received your payment of ${amount} for order #${event.order.id}.`,
      `Your current order status is ${status}.`,
      "",
      "We will notify you again as your order progresses.",
      "",
      "Hyper Play",
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="en">
        <body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#172033;">
          <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 4px 18px rgba(23,32,51,0.08);">
              <h1 style="margin:0 0 20px;font-size:24px;color:#101828;">Payment confirmed</h1>
              <p style="font-size:16px;line-height:1.6;">Hi ${escapeHtml(customerName)},</p>
              <p style="font-size:16px;line-height:1.6;">
                We received your payment for order <strong>#${escapeHtml(event.order.id)}</strong>.
              </p>
              <div style="margin:24px 0;padding:20px;background:#f8fafc;border-radius:8px;">
                <p style="margin:0 0 10px;"><strong>Amount:</strong> ${escapeHtml(amount)}</p>
                <p style="margin:0;"><strong>Order status:</strong> ${escapeHtml(status)}</p>
              </div>
              <p style="font-size:16px;line-height:1.6;">
                We will notify you again as your order progresses.
              </p>
              <p style="margin-top:28px;font-size:14px;color:#667085;">Hyper Play</p>
            </div>
          </div>
        </body>
      </html>
    `.trim(),
  };
}

module.exports = { createPaymentSucceededEmail };
