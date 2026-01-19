import ApiResponse from 'src/global/api.response';
import { ClientNotificationService } from './notification.service';
import { QueryNotificationDto } from './dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: ClientNotificationService);
    getUserNotifications(req: any, query: QueryNotificationDto): Promise<ApiResponse<{
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
    }>>;
    getUnreadCount(req: any): Promise<ApiResponse<{
        count: number;
    }>>;
    markAsRead(req: any, id: number): Promise<ApiResponse<unknown>>;
    markAllAsRead(req: any): Promise<ApiResponse<unknown>>;
    deleteNotification(req: any, id: number): Promise<ApiResponse<unknown>>;
}
