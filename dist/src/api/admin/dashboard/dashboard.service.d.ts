import { PrismaService } from 'src/prisma.service';
import { SalesStatisticsDto, ProductStatisticsDto, CustomerStatisticsDto, OrderStatisticsDto } from './dto/dashboard-stats.dto';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSalesStatistics(startDate?: string, endDate?: string): Promise<SalesStatisticsDto>;
    getProductStatistics(): Promise<ProductStatisticsDto>;
    getCustomerStatistics(startDate?: string, endDate?: string): Promise<CustomerStatisticsDto>;
    getOrderStatistics(): Promise<OrderStatisticsDto>;
    private getDateFilter;
}
