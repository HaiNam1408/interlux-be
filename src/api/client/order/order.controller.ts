// api/client/order/order.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';

@ApiTags('Order')
@Controller('order')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const order = await this.orderService.createOrder(req.user.userId, createOrderDto);
        return ApiResponse.success({
            order,
            message: 'Order created successfully',
        });
    }

    @Get()
    @ApiOperation({ summary: 'Get user\'s order list' })
    async getOrders(@Request() req) {
        const orders = await this.orderService.getOrders(req.user.userId);
        return ApiResponse.success({ orders });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    async getOrderDetail(@Request() req, @Param('id') id: string) {
        const order = await this.orderService.getOrderDetail(req.user.userId, +id);
        return ApiResponse.success({ order });
    }

    @Put(':id/cancel')
    @ApiOperation({ summary: 'Cancel an order' })
    async cancelOrder(@Request() req, @Param('id') id: string) {
        const order = await this.orderService.cancelOrder(req.user.userId, +id);
        return ApiResponse.success({
            order,
            message: 'Order cancelled successfully',
        });
    }

    @Get('shipping/methods')
    @ApiOperation({ summary: 'Get shipping methods' })
    async getShippingMethods() {
        const shippingMethods = await this.orderService.getShippingMethods();
        return ApiResponse.success({ shippingMethods });
    }
}