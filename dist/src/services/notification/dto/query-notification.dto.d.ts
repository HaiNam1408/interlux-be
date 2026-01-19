import { NotificationType } from '@prisma/client';
export declare class QueryNotificationDto {
    page?: number;
    limit?: number;
    type?: NotificationType;
    isRead?: boolean;
}
