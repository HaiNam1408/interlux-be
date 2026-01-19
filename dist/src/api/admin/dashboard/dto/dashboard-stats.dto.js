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
exports.OrderStatisticsDto = exports.CustomerStatisticsDto = exports.ProductStatisticsDto = exports.SalesStatisticsDto = exports.DashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DashboardStatsDto {
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for statistics (format: YYYY-MM-DD)',
        example: '2023-01-01',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for statistics (format: YYYY-MM-DD)',
        example: '2023-12-31',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardStatsDto.prototype, "endDate", void 0);
class SalesStatisticsDto {
}
exports.SalesStatisticsDto = SalesStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total revenue',
        example: 12500.50,
    }),
    __metadata("design:type", Number)
], SalesStatisticsDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total orders',
        example: 150,
    }),
    __metadata("design:type", Number)
], SalesStatisticsDto.prototype, "totalOrders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average order value',
        example: 83.33,
    }),
    __metadata("design:type", Number)
], SalesStatisticsDto.prototype, "averageOrderValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Revenue by status',
        example: {
            COMPLETED: 8500.25,
            DELIVERED: 4000.25,
        },
    }),
    __metadata("design:type", Object)
], SalesStatisticsDto.prototype, "revenueByStatus", void 0);
class ProductStatisticsDto {
}
exports.ProductStatisticsDto = ProductStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total products',
        example: 120,
    }),
    __metadata("design:type", Number)
], ProductStatisticsDto.prototype, "totalProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total product variations',
        example: 350,
    }),
    __metadata("design:type", Number)
], ProductStatisticsDto.prototype, "totalVariations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Products by status',
        example: {
            ACTIVE: 85,
            DRAFT: 25,
            OUTOFSTOCK: 10,
        },
    }),
    __metadata("design:type", Object)
], ProductStatisticsDto.prototype, "productsByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top selling products',
        example: [
            {
                id: 1,
                title: 'Product 1',
                sold: 45,
                revenue: 4500.00,
            },
        ],
    }),
    __metadata("design:type", Array)
], ProductStatisticsDto.prototype, "topSellingProducts", void 0);
class CustomerStatisticsDto {
}
exports.CustomerStatisticsDto = CustomerStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total customers',
        example: 250,
    }),
    __metadata("design:type", Number)
], CustomerStatisticsDto.prototype, "totalCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New customers in period',
        example: 35,
    }),
    __metadata("design:type", Number)
], CustomerStatisticsDto.prototype, "newCustomers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Top customers by order value',
        example: [
            {
                id: 1,
                username: 'john_doe',
                email: 'john@example.com',
                totalSpent: 1250.50,
                ordersCount: 5,
            },
        ],
    }),
    __metadata("design:type", Array)
], CustomerStatisticsDto.prototype, "topCustomers", void 0);
class OrderStatisticsDto {
}
exports.OrderStatisticsDto = OrderStatisticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Orders by status',
        example: {
            PENDING: 15,
            PROCESSING: 25,
            SHIPPED: 10,
            DELIVERED: 40,
            COMPLETED: 50,
            CANCELLED: 5,
        },
    }),
    __metadata("design:type", Object)
], OrderStatisticsDto.prototype, "ordersByStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recent orders',
        example: [
            {
                id: 1,
                orderNumber: 'ORD-12345',
                total: 125.50,
                status: 'COMPLETED',
                createdAt: '2023-05-15T10:30:00Z',
                username: 'john_doe',
            },
        ],
    }),
    __metadata("design:type", Array)
], OrderStatisticsDto.prototype, "recentOrders", void 0);
//# sourceMappingURL=dashboard-stats.dto.js.map