import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Query,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { GetAllOrdersDto, UpdateOrderStatusDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiTags('Admin - Order')
@Controller('order')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all orders with pagination and filtering' })
  @Get()
  async findAll(@Query() query: GetAllOrdersDto): Promise<ApiResponse<any>> {
    try {
      const { page, limit, status, search, userId } = query;
      const result = await this.orderService.findAll(page, limit, status, search, userId);
      
      return new ApiResponse(
        'Orders retrieved successfully',
        HttpStatus.OK,
        result
      );
    } catch (error) {
      return resError(error);
    }
  }

  @ApiOperation({ summary: 'Get order details by ID' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
    try {
      const order = await this.orderService.findOne(id);
      
      return new ApiResponse(
        'Order details retrieved successfully',
        HttpStatus.OK,
        order
      );
    } catch (error) {
      return resError(error);
    }
  }

  @ApiOperation({ summary: 'Update order status' })
  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<ApiResponse<any>> {
    try {
      const updatedOrder = await this.orderService.updateStatus(id, updateOrderStatusDto);
      
      return new ApiResponse(
        'Order status updated successfully',
        HttpStatus.OK,
        updatedOrder
      );
    } catch (error) {
      return resError(error);
    }
  }

  @ApiOperation({ summary: 'Get order statistics' })
  @Get('statistics/dashboard')
  async getOrderStatistics(): Promise<ApiResponse<any>> {
    try {
      const statistics = await this.orderService.getOrderStatistics();
      
      return new ApiResponse(
        'Order statistics retrieved successfully',
        HttpStatus.OK,
        statistics
      );
    } catch (error) {
      return resError(error);
    }
  }
}
