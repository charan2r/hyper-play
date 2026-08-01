import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE_NAME } from '@hyper-play/notification-contract';
import { NotificationProcessor } from './notification.processor';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE_NAME }),
    NotificationsModule,
  ],
  providers: [NotificationProcessor],
})
export class QueueModule {}
