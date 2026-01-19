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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("./order.service");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async findAll(query) {
        try {
            const { page, limit, status, search, userId } = query;
            const result = await this.orderService.findAll(page, limit, status, search, userId);
            return new api_response_1.default('Orders retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async findOne(id) {
        try {
            const order = await this.orderService.findOne(id);
            return new api_response_1.default('Order details retrieved successfully', common_1.HttpStatus.OK, order);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async updateStatus(id, updateOrderStatusDto) {
        try {
            const updatedOrder = await this.orderService.updateStatus(id, updateOrderStatusDto);
            return new api_response_1.default('Order status updated successfully', common_1.HttpStatus.OK, updatedOrder);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getOrderStatistics() {
        try {
            const statistics = await this.orderService.getOrderStatistics();
            return new api_response_1.default('Order statistics retrieved successfully', common_1.HttpStatus.OK, statistics);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders with pagination and filtering' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetAllOrdersDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get order details by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get order statistics' }),
    (0, common_1.Get)('statistics/dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderStatistics", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Order'),
    (0, common_1.Controller)('order'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map