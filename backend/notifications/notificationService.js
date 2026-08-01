const {
  isNotificationEvent,
  NOTIFICATION_EVENT_TYPES,
} = require("./notificationContract");

class NotificationService {
  async handle(event) {
    if (!isNotificationEvent(event)) {
      throw new Error("Unsupported or malformed notification event");
    }

    switch (event.eventType) {
      case NOTIFICATION_EVENT_TYPES.PAYMENT_SUCCEEDED:
        this.logPaymentSucceeded(event);
        return;
      default:
        throw new Error(`Unsupported notification event: ${event.eventType}`);
    }
  }

  logPaymentSucceeded(event) {
    console.info(
      "Payment success notification ready:",
      JSON.stringify({
        eventId: event.eventId,
        eventType: event.eventType,
        recipient: this.maskEmail(event.recipient.email),
        orderId: event.order.id,
        total: event.order.total,
        currency: event.order.currency,
        status: event.order.status,
      }),
    );
  }

  maskEmail(email) {
    const [localPart, domain] = email.split("@");
    if (!domain) return "invalid-email";
    return `${localPart.slice(0, 2)}***@${domain}`;
  }
}

module.exports = new NotificationService();
