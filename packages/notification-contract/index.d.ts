export const NOTIFICATION_QUEUE_NAME: 'notifications';
export const NOTIFICATION_SCHEMA_VERSION: 1;

export const NOTIFICATION_EVENT_TYPES: Readonly<{
  PAYMENT_SUCCEEDED: 'payment.succeeded';
}>;

export interface NotificationRecipient {
  email: string;
  name: string | null;
}

export interface NotificationOrder {
  id: string | number;
  total: number;
  currency: 'LKR';
  status: string;
}

export interface PaymentSucceededEvent {
  schemaVersion: 1;
  eventId: string;
  eventType: 'payment.succeeded';
  occurredAt: string;
  recipient: NotificationRecipient;
  order: NotificationOrder;
}

export type NotificationEvent = PaymentSucceededEvent;

export function isNotificationEvent(value: unknown): value is NotificationEvent;
