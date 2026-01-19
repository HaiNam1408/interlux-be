import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import ApiResponse from 'src/global/api.response';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getSalesStatistics(query: DashboardStatsDto): Promise<ApiResponse<import("./dto/dashboard-stats.dto").SalesStatisticsDto>>;
    getProductStatistics(): Promise<ApiResponse<import("./dto/dashboard-stats.dto").ProductStatisticsDto>>;
    getCustomerStatistics(query: DashboardStatsDto): Promise<ApiResponse<import("./dto/dashboard-stats.dto").CustomerStatisticsDto>>;
    getOrderStatistics(): Promise<ApiResponse<import("./dto/dashboard-stats.dto").OrderStatisticsDto>>;
    getAllStatistics(query: DashboardStatsDto): Promise<ApiResponse<{
        sales: import("./dto/dashboard-stats.dto").SalesStatisticsDto;
        products: import("./dto/dashboard-stats.dto").ProductStatisticsDto;
        customers: import("./dto/dashboard-stats.dto").CustomerStatisticsDto;
        orders: import("./dto/dashboard-stats.dto").OrderStatisticsDto;
    }>>;
}
