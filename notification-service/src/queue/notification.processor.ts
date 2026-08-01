import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import {
  NOTIFICATION_QUEUE_NAME,
  type NotificationEvent,
} from '@hyper-play/notification-contract';
import { NotificationsService } from '../notifications/notifications.service';

@Processor(NOTIFICATION_QUEUE_NAME, { concurrency: 5 })
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async process(job: Job<NotificationEvent>): Promise<void> {
    if (job.name !== job.data?.eventType) {
      throw new Error(
        `Job name '${job.name}' does not match event type '${job.data?.eventType}'`,
      );
    }

    await this.notificationsService.handle(job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<NotificationEvent>): void {
    this.logger.log(
      `Processed ${job.data.eventType} notification ${job.data.eventId}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NotificationEvent> | undefined, error: Error): void {
    this.logger.error(
      `Notification job ${job?.id ?? 'unknown'} failed: ${error.message}`,
    );
  }
}
