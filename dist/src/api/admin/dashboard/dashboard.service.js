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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesStatistics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate);
        const revenueData = await this.prisma.order.aggregate({
            where: {
                ...dateFilter,
                status: {
                    in: [client_1.OrderStatus.COMPLETED, client_1.OrderStatus.DELIVERED],
                },
            },
            _sum: {
                total: true,
            },
            _count: {
                id: true,
            },
        });
        const revenueByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            where: dateFilter,
            _sum: {
                total: true,
            },
        });
        const revenueByStatusMap = {};
        revenueByStatus.forEach(item => {
            revenueByStatusMap[item.status] = item._sum.total || 0;
        });
        const totalRevenue = revenueData._sum.total || 0;
        const totalOrders = revenueData._count.id || 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            revenueByStatus: revenueByStatusMap,
        };
    }
    async getProductStatistics() {
        const totalProducts = await this.prisma.product.count({
            where: {
                status: {
                    not: client_1.ProductStatus.INACTIVE,
                },
            },
        });
        const totalVariations = await this.prisma.productVariation.count();
        const productsByStatusData = await this.prisma.product.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });
        const productsByStatus = {};
        productsByStatusData.forEach(item => {
            productsByStatus[item.status] = item._count.id;
        });
        const topSellingProducts = await this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.ACTIVE,
            },
            select: {
                id: true,
                title: true,
                sold: true,
                price: true,
                percentOff: true,
            },
            orderBy: {
                sold: 'desc',
            },
            take: 5,
        });
        const formattedTopProducts = topSellingProducts.map(product => {
            const discountMultiplier = product.percentOff ? (100 - product.percentOff) / 100 : 1;
            const effectivePrice = product.price * discountMultiplier;
            const revenue = product.sold * effectivePrice;
            return {
                id: product.id,
                title: product.title,
                sold: product.sold,
                revenue: parseFloat(revenue.toFixed(2)),
            };
        });
        return {
            totalProducts,
            totalVariations,
            productsByStatus,
            topSellingProducts: formattedTopProducts,
        };
    }
    async getCustomerStatistics(startDate, endDate) {
        const dateFilter = this.getDateFilter(startDate, endDate, 'createdAt');
        const totalCustomers = await this.prisma.user.count({
            where: {
                role: client_1.Role.USER,
                status: client_1.CommonStatus.ACTIVE,
            },
        });
        const newCustomers = await this.prisma.user.count({
            where: {
                role: client_1.Role.USER,
                status: client_1.CommonStatus.ACTIVE,
                ...dateFilter,
            },
        });
        const topCustomers = await this.prisma.user.findMany({
            where: {
                role: client_1.Role.USER,
                status: client_1.CommonStatus.ACTIVE,
                orders: {
                    some: {},
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                orders: {
                    select: {
                        total: true,
                    },
                    where: {
                        status: {
                            in: [client_1.OrderStatus.COMPLETED, client_1.OrderStatus.DELIVERED],
                        },
                    },
                },
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
            take: 5,
        });
        const formattedTopCustomers = topCustomers
            .map(customer => {
            const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
            return {
                id: customer.id,
                username: customer.username,
                email: customer.email,
                totalSpent: parseFloat(totalSpent.toFixed(2)),
                ordersCount: customer._count.orders,
            };
        })
            .sort((a, b) => b.totalSpent - a.totalSpent);
        return {
            totalCustomers,
            newCustomers,
            topCustomers: formattedTopCustomers,
        };
    }
    async getOrderStatistics() {
        const ordersByStatusData = await this.prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });
        const ordersByStatus = {};
        ordersByStatusData.forEach(item => {
            ordersByStatus[item.status] = item._count.id;
        });
        const recentOrders = await this.prisma.order.findMany({
            take: 10,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                orderNumber: true,
                total: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        const formattedRecentOrders = recentOrders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt.toISOString(),
            username: order.user.username,
        }));
        return {
            ordersByStatus,
            recentOrders: formattedRecentOrders,
        };
    }
    getDateFilter(startDate, endDate, dateField = 'createdAt') {
        const filter = {};
        if (startDate || endDate) {
            filter[dateField] = {};
            if (startDate) {
                filter[dateField].gte = new Date(startDate);
            }
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                filter[dateField].lte = endDateTime;
            }
        }
        return filter;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map