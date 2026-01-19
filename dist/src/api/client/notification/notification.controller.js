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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const notification_service_1 = require("./notification.service");
const dto_1 = require("./dto");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getUserNotifications(req, query) {
        try {
            const userId = req.user.userId;
            const result = await this.notificationService.getUserNotifications(userId, query);
            return new api_response_1.default('Notifications retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getUnreadCount(req) {
        try {
            const userId = req.user.userId;
            const count = await this.notificationService.getUnreadCount(userId);
            return new api_response_1.default('Unread count retrieved successfully', common_1.HttpStatus.OK, { count });
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async markAsRead(req, id) {
        try {
            const userId = req.user.userId;
            await this.notificationService.markAsRead(userId, id);
            return new api_response_1.default('Notification marked as read', common_1.HttpStatus.OK);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async markAllAsRead(req) {
        try {
            const userId = req.user.userId;
            await this.notificationService.markAllAsRead(userId);
            return new api_response_1.default('All notifications marked as read', common_1.HttpStatus.OK);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async deleteNotification(req, id) {
        try {
            const userId = req.user.userId;
            await this.notificationService.deleteNotification(userId, id);
            return new api_response_1.default('Notification deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.QueryNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Client - Notification'),
    (0, common_1.Controller)('notification'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notification_service_1.ClientNotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map