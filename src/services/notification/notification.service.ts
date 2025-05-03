import { Injectable } from '@nestjs/common';
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

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templateService: NotificationTemplateService,
  ) {}

  /**
   * Create a new notification for a user
   * @param data Notification data
   * @returns The created notification
   */
  async create(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        relatedId: data.relatedId,
        relatedType: data.relatedType,
        isRead: false,
      },
    });
  }

  /**
   * Create notifications for multiple users
   * @param userIds Array of user IDs
   * @param data Notification data (without userId)
   * @returns Array of created notifications
   */
  async createForMultipleUsers(
    userIds: number[],
    data: Omit<CreateNotificationDto, 'userId'>,
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      title: data.title,
      content: data.content,
      type: data.type,
      relatedId: data.relatedId,
      relatedType: data.relatedType,
      isRead: false,
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  /**
   * Get all notifications for a user
   * @param userId User ID
   * @param page Page number
   * @param limit Items per page
   * @param where Additional filter conditions
   * @returns Paginated notifications
   */
  async getNotificationsForUser(userId: number, page = 1, limit = 10, where: any = {}) {
    const skip = (page - 1) * limit;

    // Merge userId with additional where conditions
    const whereCondition = { userId, ...where };

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: whereCondition,
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread notifications count for a user
   * @param userId User ID
   * @returns Count of unread notifications
   */
  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark a notification as read
   * @param id Notification ID
   * @param userId User ID (for security check)
   * @returns Updated notification
   */
  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   * @param userId User ID
   * @returns Count of updated notifications
   */
  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  /**
   * Delete a notification
   * @param id Notification ID
   * @param userId User ID (for security check)
   * @returns Deleted notification
   */
  async delete(id: number, userId: number) {
    return this.prisma.notification.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  /**
   * Delete all notifications for a user
   * @param userId User ID
   * @returns Count of deleted notifications
   */
  async deleteAll(userId: number) {
    return this.prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Create a system notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @returns Created notification
   */
  async createSystemNotification(userId: number, title: string, content: string) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.SYSTEM,
    });
  }

  /**
   * Create an order notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @param orderId Order ID
   * @returns Created notification
   */
  async createOrderNotification(
    userId: number,
    title: string,
    content: string,
    orderId: number,
  ) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.ORDER,
      relatedId: orderId,
      relatedType: 'Order',
    });
  }

  /**
   * Create a payment notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @param paymentId Payment ID
   * @returns Created notification
   */
  async createPaymentNotification(
    userId: number,
    title: string,
    content: string,
    paymentId: number,
  ) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.PAYMENT,
      relatedId: paymentId,
      relatedType: 'Payment',
    });
  }

  /**
   * Create a shipping notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @param orderId Order ID
   * @returns Created notification
   */
  async createShippingNotification(
    userId: number,
    title: string,
    content: string,
    orderId: number,
  ) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.SHIPPING,
      relatedId: orderId,
      relatedType: 'Order',
    });
  }

  /**
   * Create a promotion notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @param couponId Coupon ID (optional)
   * @returns Created notification
   */
  async createPromotionNotification(
    userId: number,
    title: string,
    content: string,
    couponId?: number,
  ) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.PROMOTION,
      relatedId: couponId,
      relatedType: couponId ? 'Coupon' : undefined,
    });
  }

  /**
   * Create a product notification for a user
   * @param userId User ID
   * @param title Notification title
   * @param content Notification content
   * @param productId Product ID
   * @returns Created notification
   */
  async createProductNotification(
    userId: number,
    title: string,
    content: string,
    productId: number,
  ) {
    return this.create({
      userId,
      title,
      content,
      type: NotificationType.PRODUCT,
      relatedId: productId,
      relatedType: 'Product',
    });
  }

  /**
   * Create a notification from a template
   * @param userId User ID
   * @param templateKey Template key
   * @param params Template parameters
   * @param relatedId Related entity ID (optional)
   * @param relatedType Related entity type (optional)
   * @returns Created notification
   */
  async createFromTemplate(
    userId: number,
    templateKey: string,
    params: NotificationTemplateParams,
    relatedId?: number,
    relatedType?: string,
  ) {
    const { title, content, type } = this.templateService.generateNotification(
      templateKey,
      params,
    );

    return this.create({
      userId,
      title,
      content,
      type,
      relatedId,
      relatedType,
    });
  }

  /**
   * Create notifications from a template for multiple users
   * @param userIds Array of user IDs
   * @param templateKey Template key
   * @param params Template parameters
   * @param relatedId Related entity ID (optional)
   * @param relatedType Related entity type (optional)
   * @returns Count of created notifications
   */
  async createFromTemplateForMultipleUsers(
    userIds: number[],
    templateKey: string,
    params: NotificationTemplateParams,
    relatedId?: number,
    relatedType?: string,
  ) {
    const { title, content, type } = this.templateService.generateNotification(
      templateKey,
      params,
    );

    return this.createForMultipleUsers(userIds, {
      title,
      content,
      type,
      relatedId,
      relatedType,
    });
  }
}
