class AddStripeWebhookEvents1720000002000 {
  name = "AddStripeWebhookEvents1720000002000";

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS stripe_webhook_events (
        event_id VARCHAR PRIMARY KEY,
        event_type VARCHAR NOT NULL,
        processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS payments_order_id_unique
      ON payments (order_id)
    `);
  }

  async down(queryRunner) {
    await queryRunner.query("DROP INDEX IF EXISTS payments_order_id_unique");
    await queryRunner.query("DROP TABLE IF EXISTS stripe_webhook_events");
  }
}

module.exports = { AddStripeWebhookEvents1720000002000 };
