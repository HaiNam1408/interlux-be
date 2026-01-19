"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderNotificationExample = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification.service");
let OrderNotificationExample = class OrderNotificationExample {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendOrderConfirmationNotification(userId, orderId, orderNumber) {
        await this.notificationService.createOrderNotification(userId, 'Order Confirmed', `Your order #${orderNumber} has been confirmed and is being processed.`, orderId);
        await this.notificationService.createFromTemplate(userId, 'ORDER_CONFIRMED', { orderNumber }, orderId, 'Order');
    }
    async sendOrderShippedNotification(userId, orderId, orderNumber, trackingNumber) {
        await this.notificationService.createFromTemplate(userId, 'ORDER_SHIPPED', { orderNumber, trackingNumber }, orderId, 'Order');
    }
    async sendPaymentReceivedNotification(userId, orderId, orderNumber, amount, currency = 'VND') {
        await this.notificationService.createFromTemplate(userId, 'PAYMENT_RECEIVED', { orderNumber, amount, currency }, orderId, 'Order');
    }
    async sendPromotionNotification(userIds, couponCode, discount, expiryDate) {
        await this.notificationService.createFromTemplateForMultipleUsers(userIds, 'NEW_COUPON', { couponCode, discount, expiryDate });
    }
};
exports.OrderNotificationExample = OrderNotificationExample;
exports.OrderNotificationExample = OrderNotificationExample = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], OrderNotificationExample);
//# sourceMappingURL=order-notification-example.js.map