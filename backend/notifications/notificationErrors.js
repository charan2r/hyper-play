class PermanentNotificationError extends Error {
  constructor(message, cause = null) {
    super(message, cause ? { cause } : undefined);
    this.name = "PermanentNotificationError";
  }
}

module.exports = { PermanentNotificationError };
