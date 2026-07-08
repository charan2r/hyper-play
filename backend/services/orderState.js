// Order status
const ORDER_STATUS = {
  CART: "CART",
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  ASSIGNED: "ASSIGNED",
  IN_PRODUCTION: "IN_PRODUCTION",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

// Payment status
const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

// Payment method
const PAYMENT_METHOD = {
  CARD: "CREDIT_CARD",
  COD: "COD",
};

// Manufacturing assignment status
const MANUFACTURING_STATUS = {
  ASSIGNED: "ASSIGNED",
  IN_PRODUCTION: "IN_PRODUCTION",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
};

// Inventory reservation status
const INVENTORY_RESERVATION_STATUS = {
  RESERVED: "RESERVED", // stock held, not yet decremented
  RELEASED: "RELEASED", // reservation cancelled; stock restored if it was CONVERTED
  CONVERTED: "CONVERTED", // payment confirmed; stock permanently decremented
};

// Valid transitions map
const VALID_TRANSITIONS = {
  // Order created, Stripe session not yet created
  [ORDER_STATUS.CART]: [
    ORDER_STATUS.PENDING_PAYMENT, // checkout initiated → Stripe session created
    ORDER_STATUS.CANCELLED, // customer abandons cart order
  ],

  // Stripe session created, awaiting payment
  [ORDER_STATUS.PENDING_PAYMENT]: [
    ORDER_STATUS.PAID, // Stripe webhook: payment success
    ORDER_STATUS.CANCELLED, // Stripe webhook: payment failed / session expired
  ],

  // Payment confirmed
  [ORDER_STATUS.PAID]: [
    ORDER_STATUS.ASSIGNED, // admin assigns a manufacturer
    ORDER_STATUS.CANCELLED, // admin cancels
  ],

  // Manufacturer assigned
  [ORDER_STATUS.ASSIGNED]: [
    ORDER_STATUS.IN_PRODUCTION, // manufacturer starts production
    ORDER_STATUS.CANCELLED, // admin cancels
  ],

  // Manufacturer actively producing
  [ORDER_STATUS.IN_PRODUCTION]: [
    ORDER_STATUS.PACKED, // manufacturer packs the order
    ORDER_STATUS.CANCELLED, // admin cancels
  ],

  // Order packed and ready to ship
  [ORDER_STATUS.PACKED]: [
    ORDER_STATUS.SHIPPED, // admin ships the order
    ORDER_STATUS.CANCELLED, // admin cancels
  ],

  // Order handed to courier
  [ORDER_STATUS.SHIPPED]: [
    ORDER_STATUS.DELIVERED, // tracking system marks delivered
  ],

  // Terminal states
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

// Role-based transition permissions

const ROLE_ALLOWED_TRANSITIONS = {
  system: [
    ORDER_STATUS.PENDING_PAYMENT, // Stripe session created
    ORDER_STATUS.PAID, // Stripe payment success
    ORDER_STATUS.CANCELLED, // Stripe payment failure / expiry
  ],

  // Admin panel
  admin: [
    ORDER_STATUS.ASSIGNED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
  ],

  // Manufacturer portal
  manufacturer: [ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.PACKED],

  // Customer can only initiate checkout. cannot cancel
  customer: [
    ORDER_STATUS.PENDING_PAYMENT, // initiates checkout from CART
  ],
};

// Guard functions

/**
 * Returns true if transitioning from `from` to `to` is a valid move.
 * @param {string} from - Current order status
 * @param {string} to   - Desired order status
 * @returns {boolean}
 */
function canTransition(from, to) {
  const allowed = VALID_TRANSITIONS[from];
  if (!allowed) return false;
  return allowed.includes(to);
}

/**
 * Throws a descriptive error if the transition is not allowed.
 * @param {string} from - Current order status
 * @param {string} to   - Desired order status
 */
function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    const allowed = VALID_TRANSITIONS[from] ?? [];
    throw new Error(
      `Invalid status transition: ${from} → ${to}. ` +
        (allowed.length > 0
          ? `Allowed next states from '${from}': ${allowed.join(", ")}.`
          : `'${from}' is a terminal state and cannot be changed.`),
    );
  }
}

/**
 * Throws if the given role is not permitted to set the target status.
 * @param {string} role      - 'admin' | 'manufacturer' | 'customer' | 'system'
 * @param {string} toStatus  - The target status being requested
 */
function assertRoleCanTransition(role, toStatus) {
  const allowed = ROLE_ALLOWED_TRANSITIONS[role] ?? [];
  if (!allowed.includes(toStatus)) {
    throw new Error(
      `Role '${role}' is not permitted to set order status to '${toStatus}'.`,
    );
  }
}

module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  MANUFACTURING_STATUS,
  INVENTORY_RESERVATION_STATUS,
  VALID_TRANSITIONS,
  ROLE_ALLOWED_TRANSITIONS,
  canTransition,
  assertTransition,
  assertRoleCanTransition,
};
