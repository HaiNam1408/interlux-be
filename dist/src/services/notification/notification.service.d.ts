import { PrismaService } from 'src/prisma.service';
import { NotificationType } from '@prisma/client';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationTemplateParams } from './interfaces/notification-template.interface';
export interface CreateNotificationDto {
    userId: number;
    title: string;
    content: string;
    type: NotificationType;
    relatedId?: number;
    relatedType?: string;
}
export declare class NotificationService {
    private readonly prisma;
    private readonly templateService;
    constructor(prisma: PrismaService, templateService: NotificationTemplateService);
    create(data: CreateNotificationDto): Promise<{
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
    }>;
    createForMultipleUsers(userIds: number[], data: Omit<CreateNotificationDto, 'userId'>): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getNotificationsForUser(userId: number, page?: number, limit?: number, where?: any): Promise<{
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
    markAsRead(id: number, userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    delete(id: number, userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAll(userId: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createSystemNotification(userId: number, title: string, content: string): Promise<{
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
    }>;
    createOrderNotification(userId: number, title: string, content: string, orderId: number): Promise<{
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
    }>;
    createPaymentNotification(userId: number, title: string, content: string, paymentId: number): Promise<{
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
    }>;
    createShippingNotification(userId: number, title: string, content: string, orderId: number): Promise<{
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
    }>;
    createPromotionNotification(userId: number, title: string, content: string, couponId?: number): Promise<{
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
    }>;
    createProductNotification(userId: number, title: string, content: string, productId: number): Promise<{
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
    }>;
    createFromTemplate(userId: number, templateKey: string, params: NotificationTemplateParams, relatedId?: number, relatedType?: string): Promise<{
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
    }>;
    createFromTemplateForMultipleUsers(userIds: number[], templateKey: string, params: NotificationTemplateParams, relatedId?: number, relatedType?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
