class AddNotificationOutbox1720000003000 {
  name = "AddNotificationOutbox1720000003000";

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE notification_outbox (
        event_id UUID PRIMARY KEY,
        event_type VARCHAR NOT NULL,
        schema_version INTEGER NOT NULL,
        payload JSONB NOT NULL,
        status VARCHAR NOT NULL DEFAULT 'PENDING',
        attempts INTEGER NOT NULL DEFAULT 0,
        available_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP,
        last_error TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT notification_outbox_status_check
          CHECK (status IN ('PENDING', 'PUBLISHED'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX notification_outbox_pending_idx
      ON notification_outbox (available_at, created_at)
      WHERE status = 'PENDING'
    `);
  }

  async down(queryRunner) {
    await queryRunner.query("DROP TABLE notification_outbox");
  }
}

module.exports = { AddNotificationOutbox1720000003000 };
