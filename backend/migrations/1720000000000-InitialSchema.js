class InitialSchema1720000000000 {
  name = "InitialSchema1720000000000";

  async up(queryRunner) {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE order_status_enum AS ENUM (
          'CART', 'PENDING_PAYMENT', 'PAID', 'ASSIGNED',
          'IN_PRODUCTION', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE payment_method_enum AS ENUM ('CREDIT_CARD', 'COD');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        first_name VARCHAR,
        last_name VARCHAR,
        phone VARCHAR,
        profile_picture TEXT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS customer (
        id SERIAL PRIMARY KEY,
        name VARCHAR,
        email VARCHAR NOT NULL UNIQUE,
        phone_number VARCHAR,
        address TEXT,
        password VARCHAR
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS manufacturer (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        phone VARCHAR,
        address TEXT,
        status VARCHAR DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password VARCHAR
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT,
        price DOUBLE PRECISION NOT NULL,
        sport VARCHAR,
        status VARCHAR DEFAULT 'active',
        stock INTEGER DEFAULT 0,
        sold INTEGER DEFAULT 0,
        created_date DATE DEFAULT CURRENT_DATE,
        category VARCHAR,
        image TEXT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cartitem (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        customer_id INTEGER NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        total_amount DOUBLE PRECISION DEFAULT 0,
        status order_status_enum DEFAULT 'PENDING_PAYMENT',
        order_date DATE DEFAULT CURRENT_DATE,
        payment_method payment_method_enum,
        payment_status payment_status_enum DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tracking_number VARCHAR,
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP,
        cancel_reason TEXT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        price DOUBLE PRECISION NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER,
        amount DOUBLE PRECISION NOT NULL,
        method payment_method_enum NOT NULL,
        status payment_status_enum DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        stripe_payment_intent_id VARCHAR,
        stripe_charge_id VARCHAR
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        previous_status VARCHAR,
        new_status VARCHAR,
        changed_by_role VARCHAR,
        changed_by_id INTEGER,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS manufacturing_assignments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        manufacturer_id INTEGER NOT NULL,
        manufacturing_status VARCHAR DEFAULT 'ASSIGNED',
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        notes TEXT
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS manufacturer_capacity (
        manufacturer_id INTEGER PRIMARY KEY,
        max_orders INTEGER DEFAULT 5,
        active_orders INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inventory_reservations (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        order_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        inventory_reservation_status VARCHAR DEFAULT 'RESERVED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async down(queryRunner) {
    await queryRunner.query("DROP TABLE IF EXISTS inventory_reservations");
    await queryRunner.query("DROP TABLE IF EXISTS manufacturer_capacity");
    await queryRunner.query("DROP TABLE IF EXISTS manufacturing_assignments");
    await queryRunner.query("DROP TABLE IF EXISTS order_status_history");
    await queryRunner.query("DROP TABLE IF EXISTS payments");
    await queryRunner.query("DROP TABLE IF EXISTS order_items");
    await queryRunner.query("DROP TABLE IF EXISTS orders");
    await queryRunner.query("DROP TABLE IF EXISTS cartitem");
    await queryRunner.query("DROP TABLE IF EXISTS product");
    await queryRunner.query("DROP TABLE IF EXISTS manufacturer");
    await queryRunner.query("DROP TABLE IF EXISTS customer");
    await queryRunner.query("DROP TABLE IF EXISTS admin");
    await queryRunner.query("DROP TYPE IF EXISTS payment_method_enum");
    await queryRunner.query("DROP TYPE IF EXISTS payment_status_enum");
    await queryRunner.query("DROP TYPE IF EXISTS order_status_enum");
  }
}

module.exports = { InitialSchema1720000000000 };
