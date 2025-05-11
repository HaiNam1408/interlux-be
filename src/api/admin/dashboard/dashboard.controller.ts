import { Controller, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import ApiResponse from 'src/global/api.response';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { resError } from 'src/global/handleError.global';

@ApiTags('Admin - Dashboard')
@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @ApiOperation({ summary: 'Get sales statistics' })
    @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
    @Get('sales')
    async getSalesStatistics(@Query() query: DashboardStatsDto) {
        try {
            const { startDate, endDate } = query;
            const data = await this.dashboardService.getSalesStatistics(startDate, endDate);
            
            return new ApiResponse(
                'Sales statistics retrieved successfully',
                HttpStatus.OK,
                data
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get product statistics' })
    @Get('products')
    async getProductStatistics() {
        try {
            const data = await this.dashboardService.getProductStatistics();
            
            return new ApiResponse(
                'Product statistics retrieved successfully',
                HttpStatus.OK,
                data
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get customer statistics' })
    @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
    @Get('customers')
    async getCustomerStatistics(@Query() query: DashboardStatsDto) {
        try {
            const { startDate, endDate } = query;
            const data = await this.dashboardService.getCustomerStatistics(startDate, endDate);
            
            return new ApiResponse(
                'Customer statistics retrieved successfully',
                HttpStatus.OK,
                data
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get order statistics' })
    @Get('orders')
    async getOrderStatistics() {
        try {
            const data = await this.dashboardService.getOrderStatistics();
            
            return new ApiResponse(
                'Order statistics retrieved successfully',
                HttpStatus.OK,
                data
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all dashboard statistics' })
    @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' })
    @Get()
    async getAllStatistics(@Query() query: DashboardStatsDto) {
        try {
            const { startDate, endDate } = query;
            
            const [sales, products, customers, orders] = await Promise.all([
                this.dashboardService.getSalesStatistics(startDate, endDate),
                this.dashboardService.getProductStatistics(),
                this.dashboardService.getCustomerStatistics(startDate, endDate),
                this.dashboardService.getOrderStatistics(),
            ]);
            
            return new ApiResponse(
                'Dashboard statistics retrieved successfully',
                HttpStatus.OK,
                {
                    sales,
                    products,
                    customers,
                    orders,
                }
            );
        } catch (error) {
            return resError(error);
        }
    }
}
