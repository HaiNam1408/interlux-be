import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class OrderNotificationExample {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Example of sending an order confirmation notification
   */
  async sendOrderConfirmationNotification(userId: number, orderId: number, orderNumber: string) {
    // Method 1: Using the direct create method
    await this.notificationService.createOrderNotification(
      userId,
      'Order Confirmed',
      `Your order #${orderNumber} has been confirmed and is being processed.`,
      orderId
    );

    // Method 2: Using the template-based method
    await this.notificationService.createFromTemplate(
      userId,
      'ORDER_CONFIRMED',
      { orderNumber },
      orderId,
      'Order'
    );
  }

  /**
   * Example of sending an order shipped notification
   */
  async sendOrderShippedNotification(userId: number, orderId: number, orderNumber: string, trackingNumber?: string) {
    await this.notificationService.createFromTemplate(
      userId,
      'ORDER_SHIPPED',
      { orderNumber, trackingNumber },
      orderId,
      'Order'
    );
  }

  /**
   * Example of sending a payment received notification
   */
  async sendPaymentReceivedNotification(userId: number, orderId: number, orderNumber: string, amount: number, currency: string = 'VND') {
    await this.notificationService.createFromTemplate(
      userId,
      'PAYMENT_RECEIVED',
      { orderNumber, amount, currency },
      orderId,
      'Order'
    );
  }

  /**
   * Example of sending a notification to multiple users (e.g., for a promotion)
   */
  async sendPromotionNotification(userIds: number[], couponCode: string, discount: string, expiryDate: string) {
    await this.notificationService.createFromTemplateForMultipleUsers(
      userIds,
      'NEW_COUPON',
      { couponCode, discount, expiryDate }
    );
  }
}
