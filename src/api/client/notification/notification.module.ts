import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationModule as NotificationServiceModule } from 'src/services/notification/notification.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/services/notification';
import { ClientNotificationService } from './notification.service';

@Module({
  imports: [NotificationServiceModule],
  controllers: [NotificationController],
  providers: [ClientNotificationService, NotificationService, JwtService, PrismaService],
  exports: [ClientNotificationService],
})
export class NotificationModule {}
