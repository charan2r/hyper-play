function getRedisConnection(maxRetriesPerRequest = 1) {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is required");
  }

  const url = new URL(process.env.REDIS_URL);
  if (!["redis:", "rediss:"].includes(url.protocol)) {
    throw new Error("REDIS_URL is not a valid Redis URL");
  }

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username ? decodeURIComponent(url.username) : undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    tls: url.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest,
  };
}

module.exports = { getRedisConnection };
