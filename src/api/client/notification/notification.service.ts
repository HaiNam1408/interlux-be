// api/client/notification/notification.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NotificationService as NotificationBaseService } from 'src/services/notification/notification.service';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Injectable()
export class ClientNotificationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationBaseService: NotificationBaseService,
    ) {}

    async getUserNotifications(userId: number, queryDto: QueryNotificationDto) {
        const { page = 1, limit = 10, type, isRead } = queryDto;

        const where: any = {};
        if (type) where.type = type;
        if (isRead !== undefined) where.isRead = isRead;

        return this.notificationBaseService.getNotificationsForUser(userId, page, limit, where);
    }

    async getUnreadCount(userId: number): Promise<number> {
        return this.notificationBaseService.getUnreadCount(userId);
    }

    async markAsRead(userId: number, id: number) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new BadRequestException('You do not have permission to access this notification');
        }

        return this.notificationBaseService.markAsRead(id, userId);
    }

    async markAllAsRead(userId: number) {
        return this.notificationBaseService.markAllAsRead(userId);
    }

    async deleteNotification(userId: number, id: number) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        if (notification.userId !== userId) {
            throw new BadRequestException('You do not have permission to access this notification');
        }

        return this.notificationBaseService.delete(id, userId);
    }
}
