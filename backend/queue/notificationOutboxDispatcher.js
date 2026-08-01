const notificationOutboxRepository = require("../repositories/notificationOutboxRepository");
const notificationQueue = require("./notificationQueue");

class NotificationOutboxDispatcher {
  constructor() {
    this.interval = null;
    this.running = false;
    this.pollInterval = Number(process.env.OUTBOX_POLL_INTERVAL);
    this.batchSize = Number(process.env.OUTBOX_BATCH_SIZE);
  }

  start() {
    if (this.interval) return;

    void this.dispatch();
    this.interval = setInterval(() => {
      void this.dispatch();
    }, this.pollInterval);
    this.interval.unref();
  }

  async dispatch() {
    if (this.running) return;
    this.running = true;

    try {
      const events = await notificationOutboxRepository.getPending(
        this.batchSize,
      );

      for (const event of events) {
        try {
          await notificationQueue.add(event.event_type, event.payload, {
            jobId: event.event_id,
          });
          await notificationOutboxRepository.markPublished(event.event_id);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown publish error";
          await notificationOutboxRepository.markPublishFailed(
            event.event_id,
            message,
            event.attempts,
          );
          console.error(
            `Failed to publish notification event ${event.event_id}:`,
            message,
          );
        }
      }
    } catch (error) {
      console.error("Notification outbox polling failed:", error.message);
    } finally {
      this.running = false;
    }
  }

  async stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    while (this.running) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    await notificationQueue.close();
  }
}

module.exports = new NotificationOutboxDispatcher();
