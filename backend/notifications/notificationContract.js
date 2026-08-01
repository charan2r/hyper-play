const NOTIFICATION_QUEUE_NAME = "notifications";
const NOTIFICATION_SCHEMA_VERSION = 1;

const NOTIFICATION_EVENT_TYPES = Object.freeze({
  PAYMENT_SUCCEEDED: "payment.succeeded",
});

function isNotificationEvent(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.schemaVersion === NOTIFICATION_SCHEMA_VERSION &&
      typeof value.eventId === "string" &&
      value.eventId.length > 0 &&
      Object.values(NOTIFICATION_EVENT_TYPES).includes(value.eventType) &&
      typeof value.occurredAt === "string" &&
      !Number.isNaN(Date.parse(value.occurredAt)) &&
      value.recipient &&
      typeof value.recipient.email === "string" &&
      value.recipient.email.includes("@") &&
      (value.recipient.name === null ||
        typeof value.recipient.name === "string") &&
      value.order &&
      ["string", "number"].includes(typeof value.order.id) &&
      Number.isFinite(value.order.total) &&
      value.order.currency === "LKR" &&
      typeof value.order.status === "string" &&
      value.order.status.length > 0,
  );
}

module.exports = {
  NOTIFICATION_QUEUE_NAME,
  NOTIFICATION_SCHEMA_VERSION,
  NOTIFICATION_EVENT_TYPES,
  isNotificationEvent,
};
