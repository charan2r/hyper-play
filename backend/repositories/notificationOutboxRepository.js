const pool = require("../config/db");

class NotificationOutboxRepository {
  async create(event, client) {
    await client.query(
      `INSERT INTO notification_outbox
         (event_id, event_type, schema_version, payload)
       VALUES ($1, $2, $3, $4::jsonb)`,
      [
        event.eventId,
        event.eventType,
        event.schemaVersion,
        JSON.stringify(event),
      ],
    );
  }

  async getPending(limit = 20) {
    const result = await pool.query(
      `SELECT event_id, event_type, payload, attempts
       FROM notification_outbox
       WHERE status = 'PENDING'
         AND available_at <= CURRENT_TIMESTAMP
       ORDER BY created_at
       LIMIT $1`,
      [limit],
    );
    return result.rows;
  }

  async markPublished(eventId) {
    await pool.query(
      `UPDATE notification_outbox
       SET status = 'PUBLISHED',
           published_at = CURRENT_TIMESTAMP,
           last_error = NULL
       WHERE event_id = $1`,
      [eventId],
    );
  }

  async markPublishFailed(eventId, errorMessage, attempts) {
    const delaySeconds = Math.min(5 * 2 ** attempts, 300);
    await pool.query(
      `UPDATE notification_outbox
       SET attempts = attempts + 1,
           available_at = CURRENT_TIMESTAMP + ($2 * INTERVAL '1 second'),
           last_error = $3
       WHERE event_id = $1`,
      [eventId, delaySeconds, errorMessage.slice(0, 2000)],
    );
  }
}

module.exports = new NotificationOutboxRepository();
