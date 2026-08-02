const {
  isNotificationEvent,
  NOTIFICATION_EVENT_TYPES,
} = require("./notificationContract");
const brevoEmailProvider = require("./brevoEmailProvider");
const { createPaymentSucceededEmail } = require("./paymentSucceededEmail");

class NotificationService {
  async handle(event) {
    if (!isNotificationEvent(event)) {
      throw new Error("Unsupported or malformed notification event");
    }

    switch (event.eventType) {
      case NOTIFICATION_EVENT_TYPES.PAYMENT_SUCCEEDED:
        await this.sendPaymentSucceeded(event);
        return;
      default:
        throw new Error(`Unsupported notification event: ${event.eventType}`);
    }
  }

  async sendPaymentSucceeded(event) {
    const email = createPaymentSucceededEmail(event);
    const result = await brevoEmailProvider.send({
      to: event.recipient.email,
      ...email,
      eventId: event.eventId,
      orderId: event.order.id,
    });

    console.info(
      "Payment success email accepted by Brevo:",
      JSON.stringify({
        eventId: event.eventId,
        eventType: event.eventType,
        recipient: this.maskEmail(event.recipient.email),
        orderId: event.order.id,
        brevoMessageId: result.emailId,
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
