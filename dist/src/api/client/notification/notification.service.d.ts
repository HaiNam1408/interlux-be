import { PrismaService } from 'src/prisma.service';
import { NotificationService as NotificationBaseService } from 'src/services/notification/notification.service';
import { QueryNotificationDto } from './dto/query-notification.dto';
export declare class ClientNotificationService {
    private readonly prisma;
    private readonly notificationBaseService;
    constructor(prisma: PrismaService, notificationBaseService: NotificationBaseService);
    getUserNotifications(userId: number, queryDto: QueryNotificationDto): Promise<{
        data: {
            title: string;
            content: string;
            id: number;
            userId: number;
            type: import(".prisma/client").$Enums.NotificationType;
            relatedId: number | null;
            relatedType: string | null;
            isRead: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: number): Promise<number>;
    markAsRead(userId: number, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(userId: number, id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
