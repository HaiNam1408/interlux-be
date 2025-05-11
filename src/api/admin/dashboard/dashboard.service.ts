import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderStatus, ProductStatus, Role, CommonStatus } from '@prisma/client';
import { 
    SalesStatisticsDto, 
    ProductStatisticsDto, 
    CustomerStatisticsDto, 
    OrderStatisticsDto 
} from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getSalesStatistics(startDate?: string, endDate?: string): Promise<SalesStatisticsDto> {
        const dateFilter = this.getDateFilter(startDate, endDate);

        // Get total revenue and orders
        const revenueData = await this.prisma.order.aggregate({
            where: {
                ...dateFilter,
                status: {
                    in: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
                },
            },
            _sum: {
                total: true,
            },
            _count: {
                id: true,
            },
        });

        // Get revenue by status
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

    async getProductStatistics(): Promise<ProductStatisticsDto> {
        // Get total products
        const totalProducts = await this.prisma.product.count({
            where: {
                status: {
                    not: ProductStatus.INACTIVE,
                },
            },
        });

        // Get total variations
        const totalVariations = await this.prisma.productVariation.count();

        // Get products by status
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

        // Get top selling products
        const topSellingProducts = await this.prisma.product.findMany({
            where: {
                status: ProductStatus.ACTIVE,
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

    async getCustomerStatistics(startDate?: string, endDate?: string): Promise<CustomerStatisticsDto> {
        const dateFilter = this.getDateFilter(startDate, endDate, 'createdAt');

        // Get total customers
        const totalCustomers = await this.prisma.user.count({
            where: {
                role: Role.USER,
                status: CommonStatus.ACTIVE,
            },
        });

        // Get new customers in period
        const newCustomers = await this.prisma.user.count({
            where: {
                role: Role.USER,
                status: CommonStatus.ACTIVE,
                ...dateFilter,
            },
        });

        // Get top customers by order value
        const topCustomers = await this.prisma.user.findMany({
            where: {
                role: Role.USER,
                status: CommonStatus.ACTIVE,
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
                            in: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
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

    async getOrderStatistics(): Promise<OrderStatisticsDto> {
        // Get orders by status
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

        // Get recent orders
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

    private getDateFilter(startDate?: string, endDate?: string, dateField: string = 'createdAt') {
        const filter: any = {};

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
}
