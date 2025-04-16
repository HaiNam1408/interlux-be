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
    @ApiOperation({ summary: 'Tạo đơn hàng mới' })
    async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        const order = await this.orderService.createOrder(req.user.id, createOrderDto);
        return ApiResponse.success({
            order,
            message: 'Đơn hàng đã được tạo thành công',
        });
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng' })
    async getOrders(@Request() req) {
        const orders = await this.orderService.getOrders(req.user.id);
        return ApiResponse.success({ orders });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy chi tiết đơn hàng' })
    async getOrderDetail(@Request() req, @Param('id') id: string) {
        const order = await this.orderService.getOrderDetail(req.user.id, +id);
        return ApiResponse.success({ order });
    }

    @Put(':id/cancel')
    @ApiOperation({ summary: 'Hủy đơn hàng' })
    async cancelOrder(@Request() req, @Param('id') id: string) {
        const order = await this.orderService.cancelOrder(req.user.id, +id);
        return ApiResponse.success({
            order,
            message: 'Đơn hàng đã được hủy thành công',
        });
    }

    @Get('shipping/methods')
    @ApiOperation({ summary: 'Lấy danh sách phương thức vận chuyển' })
    async getShippingMethods() {
        const shippingMethods = await this.orderService.getShippingMethods();
        return ApiResponse.success({ shippingMethods });
    }
}