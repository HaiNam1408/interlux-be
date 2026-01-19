import { NotificationService } from '../notification.service';
export declare class OrderNotificationExample {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendOrderConfirmationNotification(userId: number, orderId: number, orderNumber: string): Promise<void>;
    sendOrderShippedNotification(userId: number, orderId: number, orderNumber: string, trackingNumber?: string): Promise<void>;
    sendPaymentReceivedNotification(userId: number, orderId: number, orderNumber: string, amount: number, currency?: string): Promise<void>;
    sendPromotionNotification(userIds: number[], couponCode: string, discount: string, expiryDate: string): Promise<void>;
}
