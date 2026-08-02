const { UnrecoverableError, Worker } = require("bullmq");
const notificationService = require("../notifications/notificationService");
const {
  PermanentNotificationError,
} = require("../notifications/notificationErrors");
const {
  NOTIFICATION_QUEUE_NAME,
} = require("../notifications/notificationContract");
const { getRedisConnection } = require("./redisConnection");

class NotificationWorker {
  constructor() {
    this.worker = null;
  }

  start() {
    if (this.worker) return;

    this.worker = new Worker(
      NOTIFICATION_QUEUE_NAME,
      async (job) => {
        if (job.name !== job.data?.eventType) {
          throw new Error(
            `Job name '${job.name}' does not match event type '${job.data?.eventType}'`,
          );
        }
        try {
          await notificationService.handle(job.data);
        } catch (error) {
          if (error instanceof PermanentNotificationError) {
            throw new UnrecoverableError(error.message);
          }
          throw error;
        }
      },
      {
        connection: getRedisConnection(null),
        concurrency: Number(process.env.NOTIFICATION_WORKER_CONCURRENCY),
      },
    );

    this.worker.on("completed", (job) => {
      console.info(
        `Processed ${job.data.eventType} notification ${job.data.eventId}`,
      );
    });
    this.worker.on("failed", (job, error) => {
      console.error(
        `Notification job ${job?.id || "unknown"} failed:`,
        error.message,
      );
    });
    this.worker.on("error", (error) => {
      console.error("Notification worker error:", error.message);
    });
  }

  async stop() {
    if (!this.worker) return;
    await this.worker.close();
    this.worker = null;
  }
}

module.exports = new NotificationWorker();
