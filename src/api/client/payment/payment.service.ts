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
            throw new NotFoundException('Payment not found');
        }

        // Check if the payment belongs to the user
        const hasAccess = payment.orders.some((order) => order.userId === userId);
        if (!hasAccess) {
            throw new BadRequestException('You do not have permission to access this payment information');
        }

        return payment;
    }

    async verifyPayment(userId: number, verifyPaymentDto: VerifyPaymentDto) {
        const { orderId, transactionId, metadata } = verifyPaymentDto;

        // Find the order
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('You do not have permission to update this payment information');
        }

        // Check order status, can only update if the order is PENDING
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
            throw new BadRequestException('Cannot update payment information for this order');
        }

        // Update payment information
        const updatedPayment = await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: {
                transactionId,
                status: PaymentStatus.COMPLETED,
                metadata: JSON.parse(metadata),
            },
        });

        // Update order status to CONFIRMED
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CONFIRMED },
        });

        return updatedPayment;
    }

    // Create payment URL for online payment gateways
    async createPaymentUrl(userId: number, orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('You do not have permission to create payment URL for this order');
        }

        // Check order status
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Cannot create payment URL for this order');
        }

        // This is where you would integrate with payment gateways like VNPay, MoMo, PayPal...
        // Example with VNPay:
        const paymentUrl = this.generateMockPaymentUrl(order);

        return {
            paymentUrl,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.total,
        };
    }

    // Mock function to create payment URL (will be replaced with actual payment gateway integration)
    private generateMockPaymentUrl(order) {
        // In reality, you would integrate with a payment gateway here
        // For example with VNPay, MoMo, PayPal...

        return `https://payment-gateway.example.com/pay?orderNumber=${order.orderNumber}&amount=${order.total}&returnUrl=https://your-website.com/payment/callback`;
    }

    // Handle callback from payment gateway
    async handlePaymentCallback(params: any) {
        // Params may contain orderNumber, transactionId, status from the payment gateway

        // Find order based on orderNumber
        const order = await this.prisma.order.findUnique({
            where: { orderNumber: params.orderNumber },
            include: { payment: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Check and update payment status
        if (params.status === 'success') {
            // Update payment status to successful
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: {
                    transactionId: params.transactionId,
                    status: PaymentStatus.COMPLETED,
                    metadata: params,
                },
            });

            // Update order status
            await this.prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.CONFIRMED },
            });

            return {
                success: true,
                message: 'Payment successful',
            };
        } else {
            // Update payment status to failed
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
                message: 'Payment failed',
            };
        }
    }
}