const { BrevoClient, BrevoError } = require("@getbrevo/brevo");
const { PermanentNotificationError } = require("./notificationErrors");

const PERMANENT_STATUS_CODES = new Set([
  400, 401, 402, 403, 404, 405, 406, 422,
]);

const PERMANENT_ERROR_CODES = new Set([
  "account_under_validation",
  "document_not_found",
  "invalid_parameter",
  "method_not_allowed",
  "missing_parameter",
  "not_enough_credits",
  "out_of_range",
  "permission_denied",
  "unauthorized",
]);

class BrevoEmailProvider {
  constructor() {
    this.client = null;
    this.configuredApiKey = null;
  }

  configure() {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.BREVO_FROM_EMAIL;

    if (!apiKey) {
      throw new PermanentNotificationError("BREVO_API_KEY is required");
    }
    if (!fromEmail) {
      throw new PermanentNotificationError("BREVO_FROM_EMAIL is required");
    }

    if (this.configuredApiKey !== apiKey) {
      this.client = new BrevoClient({
        apiKey,
        maxRetries: 0,
        timeoutInSeconds: 15,
      });
      this.configuredApiKey = apiKey;
    }

    return {
      email: fromEmail.trim(),
      name: process.env.BREVO_FROM_NAME.replace(/[\r\n<>]/g, "").trim(),
    };
  }

  async send({ to, subject, text, html, eventId, orderId }) {
    const sender = this.configure();

    try {
      const result = await this.client.transactionalEmails.sendTransacEmail({
        sender,
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
        headers: {
          "Idempotency-Key": String(eventId),
          "X-Hyper-Play-Event-Id": String(eventId),
          "X-Hyper-Play-Order-Id": String(orderId),
        },
        tags: ["payment-succeeded"],
      });

      return { emailId: result.messageId || null };
    } catch (error) {
      if (error instanceof PermanentNotificationError) {
        throw error;
      }

      this.throwBrevoError(error);
    }
  }

  throwBrevoError(error) {
    const body = error instanceof BrevoError ? error.body : null;
    const errorCode = body && typeof body === "object" ? body.code : null;
    const detail =
      body && typeof body === "object" && typeof body.message === "string"
        ? body.message
        : error.message;
    const message = `Brevo rejected the email: ${detail || "Unknown error"}`;

    if (
      (error instanceof BrevoError &&
        PERMANENT_STATUS_CODES.has(error.statusCode)) ||
      PERMANENT_ERROR_CODES.has(errorCode)
    ) {
      throw new PermanentNotificationError(message, error);
    }

    throw new Error(`Brevo email failed: ${detail || "Unknown error"}`, {
      cause: error,
    });
  }
}

module.exports = new BrevoEmailProvider();
