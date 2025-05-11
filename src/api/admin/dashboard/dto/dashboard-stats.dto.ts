import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DashboardStatsDto {
    @ApiProperty({
        description: 'Start date for statistics (format: YYYY-MM-DD)',
        example: '2023-01-01',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({
        description: 'End date for statistics (format: YYYY-MM-DD)',
        example: '2023-12-31',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}

export class SalesStatisticsDto {
    @ApiProperty({
        description: 'Total revenue',
        example: 12500.50,
    })
    totalRevenue: number;

    @ApiProperty({
        description: 'Total orders',
        example: 150,
    })
    totalOrders: number;

    @ApiProperty({
        description: 'Average order value',
        example: 83.33,
    })
    averageOrderValue: number;

    @ApiProperty({
        description: 'Revenue by status',
        example: {
            COMPLETED: 8500.25,
            DELIVERED: 4000.25,
        },
    })
    revenueByStatus: Record<string, number>;
}

export class ProductStatisticsDto {
    @ApiProperty({
        description: 'Total products',
        example: 120,
    })
    totalProducts: number;

    @ApiProperty({
        description: 'Total product variations',
        example: 350,
    })
    totalVariations: number;

    @ApiProperty({
        description: 'Products by status',
        example: {
            ACTIVE: 85,
            DRAFT: 25,
            OUTOFSTOCK: 10,
        },
    })
    productsByStatus: Record<string, number>;

    @ApiProperty({
        description: 'Top selling products',
        example: [
            {
                id: 1,
                title: 'Product 1',
                sold: 45,
                revenue: 4500.00,
            },
        ],
    })
    topSellingProducts: Array<{
        id: number;
        title: string;
        sold: number;
        revenue: number;
    }>;
}

export class CustomerStatisticsDto {
    @ApiProperty({
        description: 'Total customers',
        example: 250,
    })
    totalCustomers: number;

    @ApiProperty({
        description: 'New customers in period',
        example: 35,
    })
    newCustomers: number;

    @ApiProperty({
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
    })
    topCustomers: Array<{
        id: number;
        username: string;
        email: string;
        totalSpent: number;
        ordersCount: number;
    }>;
}

export class OrderStatisticsDto {
    @ApiProperty({
        description: 'Orders by status',
        example: {
            PENDING: 15,
            PROCESSING: 25,
            SHIPPED: 10,
            DELIVERED: 40,
            COMPLETED: 50,
            CANCELLED: 5,
        },
    })
    ordersByStatus: Record<string, number>;

    @ApiProperty({
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
    })
    recentOrders: Array<{
        id: number;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
        username: string;
    }>;
}
