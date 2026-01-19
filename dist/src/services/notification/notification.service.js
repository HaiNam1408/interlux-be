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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
const client_1 = require("@prisma/client");
const notification_template_service_1 = require("./notification-template.service");
let NotificationService = class NotificationService {
    constructor(prisma, templateService) {
        this.prisma = prisma;
        this.templateService = templateService;
    }
    async create(data) {
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
    async createForMultipleUsers(userIds, data) {
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
    async getNotificationsForUser(userId, page = 1, limit = 10, where = {}) {
        const skip = (page - 1) * limit;
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
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
    async markAsRead(id, userId) {
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
    async markAllAsRead(userId) {
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
    async delete(id, userId) {
        return this.prisma.notification.deleteMany({
            where: {
                id,
                userId,
            },
        });
    }
    async deleteAll(userId) {
        return this.prisma.notification.deleteMany({
            where: {
                userId,
            },
        });
    }
    async createSystemNotification(userId, title, content) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.SYSTEM,
        });
    }
    async createOrderNotification(userId, title, content, orderId) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.ORDER,
            relatedId: orderId,
            relatedType: 'Order',
        });
    }
    async createPaymentNotification(userId, title, content, paymentId) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.PAYMENT,
            relatedId: paymentId,
            relatedType: 'Payment',
        });
    }
    async createShippingNotification(userId, title, content, orderId) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.SHIPPING,
            relatedId: orderId,
            relatedType: 'Order',
        });
    }
    async createPromotionNotification(userId, title, content, couponId) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.PROMOTION,
            relatedId: couponId,
            relatedType: couponId ? 'Coupon' : undefined,
        });
    }
    async createProductNotification(userId, title, content, productId) {
        return this.create({
            userId,
            title,
            content,
            type: client_1.NotificationType.PRODUCT,
            relatedId: productId,
            relatedType: 'Product',
        });
    }
    async createFromTemplate(userId, templateKey, params, relatedId, relatedType) {
        const { title, content, type } = this.templateService.generateNotification(templateKey, params);
        return this.create({
            userId,
            title,
            content,
            type,
            relatedId,
            relatedType,
        });
    }
    async createFromTemplateForMultipleUsers(userIds, templateKey, params, relatedId, relatedType) {
        const { title, content, type } = this.templateService.generateNotification(templateKey, params);
        return this.createForMultipleUsers(userIds, {
            title,
            content,
            type,
            relatedId,
            relatedType,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_template_service_1.NotificationTemplateService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map