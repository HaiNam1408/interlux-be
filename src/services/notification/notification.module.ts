import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationTemplateService } from './notification-template.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [NotificationService, NotificationTemplateService, PrismaService],
  exports: [NotificationService, NotificationTemplateService],
})
export class NotificationModule {}
