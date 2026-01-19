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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_stats_dto_1 = require("./dto/dashboard-stats.dto");
const api_response_1 = require("../../../global/api.response");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
const handleError_global_1 = require("../../../global/handleError.global");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getSalesStatistics(query) {
        try {
            const { startDate, endDate } = query;
            const data = await this.dashboardService.getSalesStatistics(startDate, endDate);
            return new api_response_1.default('Sales statistics retrieved successfully', common_1.HttpStatus.OK, data);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getProductStatistics() {
        try {
            const data = await this.dashboardService.getProductStatistics();
            return new api_response_1.default('Product statistics retrieved successfully', common_1.HttpStatus.OK, data);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getCustomerStatistics(query) {
        try {
            const { startDate, endDate } = query;
            const data = await this.dashboardService.getCustomerStatistics(startDate, endDate);
            return new api_response_1.default('Customer statistics retrieved successfully', common_1.HttpStatus.OK, data);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getOrderStatistics() {
        try {
            const data = await this.dashboardService.getOrderStatistics();
            return new api_response_1.default('Order statistics retrieved successfully', common_1.HttpStatus.OK, data);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getAllStatistics(query) {
        try {
            const { startDate, endDate } = query;
            const [sales, products, customers, orders] = await Promise.all([
                this.dashboardService.getSalesStatistics(startDate, endDate),
                this.dashboardService.getProductStatistics(),
                this.dashboardService.getCustomerStatistics(startDate, endDate),
                this.dashboardService.getOrderStatistics(),
            ]);
            return new api_response_1.default('Dashboard statistics retrieved successfully', common_1.HttpStatus.OK, {
                sales,
                products,
                customers,
                orders,
            });
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get sales statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, common_1.Get)('sales'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_stats_dto_1.DashboardStatsDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSalesStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product statistics' }),
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProductStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get customer statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, common_1.Get)('customers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_stats_dto_1.DashboardStatsDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getCustomerStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get order statistics' }),
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getOrderStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all dashboard statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dashboard_stats_dto_1.DashboardStatsDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAllStatistics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Dashboard'),
    (0, common_1.Controller)('dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map