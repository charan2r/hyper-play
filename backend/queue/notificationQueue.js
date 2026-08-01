const { Queue } = require("bullmq");
const {
  NOTIFICATION_QUEUE_NAME,
} = require("@hyper-play/notification-contract");
const { getRedisConnection } = require("./redisConnection");

const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
    removeOnFail: false,
  },
});

notificationQueue.on("error", (error) => {
  console.error("Notification queue error:", error.message);
});

module.exports = notificationQueue;
