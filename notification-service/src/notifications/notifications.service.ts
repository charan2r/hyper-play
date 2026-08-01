import { Injectable, Logger } from '@nestjs/common';
import {
  isNotificationEvent,
  NOTIFICATION_EVENT_TYPES,
  type NotificationEvent,
} from '@hyper-play/notification-contract';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async handle(event: unknown): Promise<void> {
    if (!isNotificationEvent(event)) {
      throw new Error('Unsupported or malformed notification event');
    }

    switch (event.eventType) {
      case NOTIFICATION_EVENT_TYPES.PAYMENT_SUCCEEDED:
        this.logPaymentSucceeded(event);
        return;
      default:
        throw new Error('Unsupported notification event type');
    }
  }

  private logPaymentSucceeded(event: NotificationEvent): void {
    this.logger.log(
      JSON.stringify({
        message: 'Payment success notification ready',
        eventId: event.eventId,
        eventType: event.eventType,
        recipient: this.maskEmail(event.recipient.email),
        orderId: event.order.id,
        total: event.order.total,
        currency: event.order.currency,
        status: event.order.status,
      }),
    );
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (!domain) return 'invalid-email';
    return `${localPart.slice(0, 2)}***@${domain}`;
  }
}
