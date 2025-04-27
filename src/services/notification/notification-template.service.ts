import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationTemplate, NotificationTemplateParams } from './interfaces/notification-template.interface';

@Injectable()
export class NotificationTemplateService {
  private templates: Record<string, NotificationTemplate> = {
    // Order related templates
    ORDER_CREATED: {
      type: NotificationType.ORDER,
      title: 'Order Created',
      content: 'Your order #{orderId} has been created successfully.',
      getTitle: (params) => 'Order Created',
      getContent: (params) => `Your order #${params.orderNumber} has been created successfully. The total amount is ${params.total} ${params.currency || 'USD'}.`,
    },
    ORDER_CONFIRMED: {
      type: NotificationType.ORDER,
      title: 'Order Confirmed',
      content: 'Your order #{orderId} has been confirmed.',
      getTitle: (params) => 'Order Confirmed',
      getContent: (params) => `Your order #${params.orderNumber} has been confirmed and is being processed.`,
    },
    ORDER_SHIPPED: {
      type: NotificationType.SHIPPING,
      title: 'Order Shipped',
      content: 'Your order #{orderId} has been shipped.',
      getTitle: (params) => 'Order Shipped',
      getContent: (params) => `Your order #${params.orderNumber} has been shipped. ${params.trackingNumber ? `Tracking number: ${params.trackingNumber}` : ''}`,
    },
    ORDER_DELIVERED: {
      type: NotificationType.SHIPPING,
      title: 'Order Delivered',
      content: 'Your order #{orderId} has been delivered.',
      getTitle: (params) => 'Order Delivered',
      getContent: (params) => `Your order #${params.orderNumber} has been delivered. Thank you for shopping with us!`,
    },
    ORDER_CANCELLED: {
      type: NotificationType.ORDER,
      title: 'Order Cancelled',
      content: 'Your order #{orderId} has been cancelled.',
      getTitle: (params) => 'Order Cancelled',
      getContent: (params) => `Your order #${params.orderNumber} has been cancelled. ${params.reason ? `Reason: ${params.reason}` : ''}`,
    },

    // Payment related templates
    PAYMENT_RECEIVED: {
      type: NotificationType.PAYMENT,
      title: 'Payment Received',
      content: 'We have received your payment for order #{orderId}.',
      getTitle: (params) => 'Payment Received',
      getContent: (params) => `We have received your payment of ${params.amount} ${params.currency || 'USD'} for order #${params.orderNumber}.`,
    },
    PAYMENT_FAILED: {
      type: NotificationType.PAYMENT,
      title: 'Payment Failed',
      content: 'Your payment for order #{orderId} has failed.',
      getTitle: (params) => 'Payment Failed',
      getContent: (params) => `Your payment for order #${params.orderNumber} has failed. ${params.reason ? `Reason: ${params.reason}` : 'Please try again or contact customer support.'}`,
    },
    PAYMENT_REFUNDED: {
      type: NotificationType.PAYMENT,
      title: 'Payment Refunded',
      content: 'Your payment for order #{orderId} has been refunded.',
      getTitle: (params) => 'Payment Refunded',
      getContent: (params) => `Your payment of ${params.amount} ${params.currency || 'USD'} for order #${params.orderNumber} has been refunded. The refund may take 3-5 business days to appear in your account.`,
    },

    // Promotion related templates
    NEW_COUPON: {
      type: NotificationType.PROMOTION,
      title: 'New Coupon Available',
      content: 'A new coupon is available for you.',
      getTitle: (params) => 'New Coupon Available',
      getContent: (params) => `A new coupon "${params.couponCode}" is available for you. ${params.discount ? `Get ${params.discount} off your next purchase.` : ''} ${params.expiryDate ? `Valid until ${params.expiryDate}.` : ''}`,
    },
    COUPON_EXPIRING: {
      type: NotificationType.PROMOTION,
      title: 'Coupon Expiring Soon',
      content: 'Your coupon is expiring soon.',
      getTitle: (params) => 'Coupon Expiring Soon',
      getContent: (params) => `Your coupon "${params.couponCode}" is expiring soon. Use it before ${params.expiryDate} to get ${params.discount} off your purchase.`,
    },
    SPECIAL_OFFER: {
      type: NotificationType.PROMOTION,
      title: 'Special Offer',
      content: 'A special offer is available for you.',
      getTitle: (params) => params.title || 'Special Offer',
      getContent: (params) => params.content || 'A special offer is available for you. Check it out now!',
    },

    // Product related templates
    PRODUCT_BACK_IN_STOCK: {
      type: NotificationType.PRODUCT,
      title: 'Product Back in Stock',
      content: 'A product you were interested in is back in stock.',
      getTitle: (params) => 'Product Back in Stock',
      getContent: (params) => `${params.productName} is back in stock. Get it now before it sells out again!`,
    },
    PRODUCT_PRICE_DROP: {
      type: NotificationType.PRODUCT,
      title: 'Price Drop Alert',
      content: 'A product you were interested in has dropped in price.',
      getTitle: (params) => 'Price Drop Alert',
      getContent: (params) => `${params.productName} is now available at a lower price of ${params.newPrice} ${params.currency || 'USD'}. ${params.oldPrice ? `(Was ${params.oldPrice} ${params.currency || 'USD'})` : ''}`,
    },
    NEW_PRODUCT: {
      type: NotificationType.PRODUCT,
      title: 'New Product Available',
      content: 'A new product is available in our store.',
      getTitle: (params) => 'New Product Available',
      getContent: (params) => `Check out our new product: ${params.productName}. ${params.description || ''}`,
    },

    // System related templates
    ACCOUNT_CREATED: {
      type: NotificationType.SYSTEM,
      title: 'Account Created',
      content: 'Your account has been created successfully.',
      getTitle: (params) => 'Account Created',
      getContent: (params) => `Welcome to InterLux! Your account has been created successfully.`,
    },
    PASSWORD_CHANGED: {
      type: NotificationType.SYSTEM,
      title: 'Password Changed',
      content: 'Your password has been changed successfully.',
      getTitle: (params) => 'Password Changed',
      getContent: (params) => `Your password has been changed successfully. If you did not make this change, please contact customer support immediately.`,
    },
    PROFILE_UPDATED: {
      type: NotificationType.SYSTEM,
      title: 'Profile Updated',
      content: 'Your profile has been updated successfully.',
      getTitle: (params) => 'Profile Updated',
      getContent: (params) => `Your profile information has been updated successfully.`,
    },
  };

  /**
   * Get a notification template by key
   * @param key Template key
   * @returns Notification template
   */
  getTemplate(key: string): NotificationTemplate | undefined {
    return this.templates[key];
  }

  /**
   * Generate notification title and content from a template
   * @param templateKey Template key
   * @param params Template parameters
   * @returns Object containing title, content, and type
   */
  generateNotification(templateKey: string, params: NotificationTemplateParams) {
    const template = this.getTemplate(templateKey);
    
    if (!template) {
      throw new Error(`Notification template "${templateKey}" not found`);
    }

    return {
      title: template.getTitle(params),
      content: template.getContent(params),
      type: template.type,
    };
  }

  /**
   * Add a custom template
   * @param key Template key
   * @param template Notification template
   */
  addTemplate(key: string, template: NotificationTemplate) {
    this.templates[key] = template;
  }
}
