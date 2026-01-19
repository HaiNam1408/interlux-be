import { NotificationType } from '@prisma/client';
export declare class CreateNotificationDto {
    userId: number;
    title: string;
    content: string;
    type: NotificationType;
    relatedId?: number;
    relatedType?: string;
}
