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
exports.ClientNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const notification_service_1 = require("../../../services/notification/notification.service");
let ClientNotificationService = class ClientNotificationService {
    constructor(prisma, notificationBaseService) {
        this.prisma = prisma;
        this.notificationBaseService = notificationBaseService;
    }
    async getUserNotifications(userId, queryDto) {
        const { page = 1, limit = 10, type, isRead } = queryDto;
        const where = {};
        if (type)
            where.type = type;
        if (isRead !== undefined)
            where.isRead = isRead;
        return this.notificationBaseService.getNotificationsForUser(userId, page, limit, where);
    }
    async getUnreadCount(userId) {
        return this.notificationBaseService.getUnreadCount(userId);
    }
    async markAsRead(userId, id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to access this notification');
        }
        return this.notificationBaseService.markAsRead(id, userId);
    }
    async markAllAsRead(userId) {
        return this.notificationBaseService.markAllAsRead(userId);
    }
    async deleteNotification(userId, id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to access this notification');
        }
        return this.notificationBaseService.delete(id, userId);
    }
};
exports.ClientNotificationService = ClientNotificationService;
exports.ClientNotificationService = ClientNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ClientNotificationService);
//# sourceMappingURL=notification.service.js.map