class RemoveCartOrderStatus1720000001000 {
  name = "RemoveCartOrderStatus1720000001000";

  async up(queryRunner) {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'order_status_enum' AND e.enumlabel = 'CART'
        ) THEN
          IF EXISTS (SELECT 1 FROM orders WHERE status::text = 'CART') THEN
            RAISE EXCEPTION 'Cannot remove CART status while orders still use it';
          END IF;

          ALTER TYPE order_status_enum RENAME TO order_status_enum_old;
          CREATE TYPE order_status_enum AS ENUM (
            'PENDING_PAYMENT', 'PAID', 'ASSIGNED', 'IN_PRODUCTION',
            'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
          );
          ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
          ALTER TABLE orders
            ALTER COLUMN status TYPE order_status_enum
            USING status::text::order_status_enum;
          ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'PENDING_PAYMENT';
          DROP TYPE order_status_enum_old;
        END IF;
      END $$
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TYPE order_status_enum RENAME TO order_status_enum_old;
      CREATE TYPE order_status_enum AS ENUM (
        'CART', 'PENDING_PAYMENT', 'PAID', 'ASSIGNED', 'IN_PRODUCTION',
        'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
      );
      ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
      ALTER TABLE orders
        ALTER COLUMN status TYPE order_status_enum
        USING status::text::order_status_enum;
      ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'PENDING_PAYMENT';
      DROP TYPE order_status_enum_old;
    `);
  }
}

module.exports = { RemoveCartOrderStatus1720000001000 };
