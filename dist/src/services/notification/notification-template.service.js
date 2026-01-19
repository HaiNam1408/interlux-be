"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplateService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let NotificationTemplateService = class NotificationTemplateService {
    constructor() {
        this.templates = {
            ORDER_CREATED: {
                type: client_1.NotificationType.ORDER,
                title: 'Order Created',
                content: 'Your order #{orderId} has been created successfully.',
                getTitle: (params) => 'Order Created',
                getContent: (params) => `Your order #${params.orderNumber} has been created successfully. The total amount is ${params.total} ${params.currency || 'USD'}.`,
            },
            ORDER_CONFIRMED: {
                type: client_1.NotificationType.ORDER,
                title: 'Order Confirmed',
                content: 'Your order #{orderId} has been confirmed.',
                getTitle: (params) => 'Order Confirmed',
                getContent: (params) => `Your order #${params.orderNumber} has been confirmed and is being processed.`,
            },
            ORDER_SHIPPED: {
                type: client_1.NotificationType.SHIPPING,
                title: 'Order Shipped',
                content: 'Your order #{orderId} has been shipped.',
                getTitle: (params) => 'Order Shipped',
                getContent: (params) => `Your order #${params.orderNumber} has been shipped. ${params.trackingNumber ? `Tracking number: ${params.trackingNumber}` : ''}`,
            },
            ORDER_DELIVERED: {
                type: client_1.NotificationType.SHIPPING,
                title: 'Order Delivered',
                content: 'Your order #{orderId} has been delivered.',
                getTitle: (params) => 'Order Delivered',
                getContent: (params) => `Your order #${params.orderNumber} has been delivered. Thank you for shopping with us!`,
            },
            ORDER_CANCELLED: {
                type: client_1.NotificationType.ORDER,
                title: 'Order Cancelled',
                content: 'Your order #{orderId} has been cancelled.',
                getTitle: (params) => 'Order Cancelled',
                getContent: (params) => `Your order #${params.orderNumber} has been cancelled. ${params.reason ? `Reason: ${params.reason}` : ''}`,
            },
            PAYMENT_RECEIVED: {
                type: client_1.NotificationType.PAYMENT,
                title: 'Payment Received',
                content: 'We have received your payment for order #{orderId}.',
                getTitle: (params) => 'Payment Received',
                getContent: (params) => `We have received your payment of ${params.amount} ${params.currency || 'USD'} for order #${params.orderNumber}.`,
            },
            PAYMENT_FAILED: {
                type: client_1.NotificationType.PAYMENT,
                title: 'Payment Failed',
                content: 'Your payment for order #{orderId} has failed.',
                getTitle: (params) => 'Payment Failed',
                getContent: (params) => `Your payment for order #${params.orderNumber} has failed. ${params.reason ? `Reason: ${params.reason}` : 'Please try again or contact customer support.'}`,
            },
            PAYMENT_REFUNDED: {
                type: client_1.NotificationType.PAYMENT,
                title: 'Payment Refunded',
                content: 'Your payment for order #{orderId} has been refunded.',
                getTitle: (params) => 'Payment Refunded',
                getContent: (params) => `Your payment of ${params.amount} ${params.currency || 'USD'} for order #${params.orderNumber} has been refunded. The refund may take 3-5 business days to appear in your account.`,
            },
            NEW_COUPON: {
                type: client_1.NotificationType.PROMOTION,
                title: 'New Coupon Available',
                content: 'A new coupon is available for you.',
                getTitle: (params) => 'New Coupon Available',
                getContent: (params) => `A new coupon "${params.couponCode}" is available for you. ${params.discount ? `Get ${params.discount} off your next purchase.` : ''} ${params.expiryDate ? `Valid until ${params.expiryDate}.` : ''}`,
            },
            COUPON_EXPIRING: {
                type: client_1.NotificationType.PROMOTION,
                title: 'Coupon Expiring Soon',
                content: 'Your coupon is expiring soon.',
                getTitle: (params) => 'Coupon Expiring Soon',
                getContent: (params) => `Your coupon "${params.couponCode}" is expiring soon. Use it before ${params.expiryDate} to get ${params.discount} off your purchase.`,
            },
            SPECIAL_OFFER: {
                type: client_1.NotificationType.PROMOTION,
                title: 'Special Offer',
                content: 'A special offer is available for you.',
                getTitle: (params) => params.title || 'Special Offer',
                getContent: (params) => params.content || 'A special offer is available for you. Check it out now!',
            },
            PRODUCT_BACK_IN_STOCK: {
                type: client_1.NotificationType.PRODUCT,
                title: 'Product Back in Stock',
                content: 'A product you were interested in is back in stock.',
                getTitle: (params) => 'Product Back in Stock',
                getContent: (params) => `${params.productName} is back in stock. Get it now before it sells out again!`,
            },
            PRODUCT_PRICE_DROP: {
                type: client_1.NotificationType.PRODUCT,
                title: 'Price Drop Alert',
                content: 'A product you were interested in has dropped in price.',
                getTitle: (params) => 'Price Drop Alert',
                getContent: (params) => `${params.productName} is now available at a lower price of ${params.newPrice} ${params.currency || 'USD'}. ${params.oldPrice ? `(Was ${params.oldPrice} ${params.currency || 'USD'})` : ''}`,
            },
            NEW_PRODUCT: {
                type: client_1.NotificationType.PRODUCT,
                title: 'New Product Available',
                content: 'A new product is available in our store.',
                getTitle: (params) => 'New Product Available',
                getContent: (params) => `Check out our new product: ${params.productName}. ${params.description || ''}`,
            },
            ACCOUNT_CREATED: {
                type: client_1.NotificationType.SYSTEM,
                title: 'Account Created',
                content: 'Your account has been created successfully.',
                getTitle: (params) => 'Account Created',
                getContent: (params) => `Welcome to InterLux! Your account has been created successfully.`,
            },
            PASSWORD_CHANGED: {
                type: client_1.NotificationType.SYSTEM,
                title: 'Password Changed',
                content: 'Your password has been changed successfully.',
                getTitle: (params) => 'Password Changed',
                getContent: (params) => `Your password has been changed successfully. If you did not make this change, please contact customer support immediately.`,
            },
            PROFILE_UPDATED: {
                type: client_1.NotificationType.SYSTEM,
                title: 'Profile Updated',
                content: 'Your profile has been updated successfully.',
                getTitle: (params) => 'Profile Updated',
                getContent: (params) => `Your profile information has been updated successfully.`,
            },
        };
    }
    getTemplate(key) {
        return this.templates[key];
    }
    generateNotification(templateKey, params) {
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
    addTemplate(key, template) {
        this.templates[key] = template;
    }
};
exports.NotificationTemplateService = NotificationTemplateService;
exports.NotificationTemplateService = NotificationTemplateService = __decorate([
    (0, common_1.Injectable)()
], NotificationTemplateService);
//# sourceMappingURL=notification-template.service.js.map