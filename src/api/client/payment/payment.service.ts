import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { VerifyPaymentDto } from './dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    async getPaymentDetail(userId: number, paymentId: number) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                orders: {
                    include: {
                        items: true,
                        shipping: true,
                        coupon: true,
                    },
                },
            },
        });

        if (!payment) {
            throw new NotFoundException('Thanh toán không tồn tại');
        }

        // Kiểm tra xem thanh toán có thuộc về người dùng không
        const hasAccess = payment.orders.some((order) => order.userId === userId);
        if (!hasAccess) {
            throw new BadRequestException('Bạn không có quyền truy cập thông tin thanh toán này');
        }

        return payment;
    }

    async verifyPayment(userId: number, verifyPaymentDto: VerifyPaymentDto) {
        const { orderId, transactionId, metadata } = verifyPaymentDto;

        // Tìm đơn hàng
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền cập nhật thông tin thanh toán này');
        }

        // Kiểm tra trạng thái đơn hàng, chỉ có thể cập nhật nếu đơn hàng đang PENDING
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
            throw new BadRequestException('Không thể cập nhật thông tin thanh toán cho đơn hàng này');
        }

        // Cập nhật thông tin thanh toán
        const updatedPayment = await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: {
                transactionId,
                status: PaymentStatus.COMPLETED,
                metadata: JSON.parse(metadata),
            },
        });

        // Cập nhật trạng thái đơn hàng sang CONFIRMED
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CONFIRMED },
        });

        return updatedPayment;
    }

    // Tạo URL thanh toán cho các cổng thanh toán trực tuyến
    async createPaymentUrl(userId: number, orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền tạo URL thanh toán cho đơn hàng này');
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Không thể tạo URL thanh toán cho đơn hàng này');
        }

        // Đây là nơi bạn sẽ tích hợp với các cổng thanh toán như VNPay, MoMo, PayPal...
        // Ví dụ với VNPay:
        const paymentUrl = this.generateMockPaymentUrl(order);

        return {
            paymentUrl,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.total,
        };
    }

    // Hàm giả lập tạo URL thanh toán (sẽ thay thế bằng tích hợp thực tế với cổng thanh toán)
    private generateMockPaymentUrl(order) {
        // Trong thực tế, bạn sẽ tích hợp với cổng thanh toán ở đây
        // Ví dụ với VNPay, MoMo, PayPal...

        return `https://payment-gateway.example.com/pay?orderNumber=${order.orderNumber}&amount=${order.total}&returnUrl=https://your-website.com/payment/callback`;
    }

    // Xử lý callback từ cổng thanh toán
    async handlePaymentCallback(params: any) {
        // Params có thể chứa orderNumber, transactionId, status từ cổng thanh toán

        // Tìm đơn hàng dựa trên orderNumber
        const order = await this.prisma.order.findUnique({
            where: { orderNumber: params.orderNumber },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        // Kiểm tra và cập nhật trạng thái thanh toán
        if (params.status === 'success') {
            // Cập nhật trạng thái thanh toán thành công
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: {
                    transactionId: params.transactionId,
                    status: PaymentStatus.COMPLETED,
                    metadata: params,
                },
            });

            // Cập nhật trạng thái đơn hàng
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.CONFIRMED },
            });

            return {
                success: true,
                message: 'Thanh toán thành công',
            };
        } else {
            // Cập nhật trạng thái thanh toán thất bại
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: {
                    transactionId: params.transactionId,
                    status: PaymentStatus.FAILED,
                    metadata: params,
                },
            });

            return {
                success: false,
                message: 'Thanh toán thất bại',
            };
        }
    }
}