import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { VerifyPaymentDto } from './dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PaymentStrategyFactory } from './strategies';
import { NotificationService } from 'src/services/notification/notification.service';
import { MailService } from 'src/services/mail/mail.service';

@Injectable()
export class PaymentService {
    constructor(
        private prisma: PrismaService,
        private paymentStrategyFactory: PaymentStrategyFactory,
        private notificationService: NotificationService,
        private mailService: MailService
    ) { }

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

        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                payment: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                images: true,
                            }
                        },
                        productVariation: true
                    }
                }
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('You do not have permission to update this payment information');
        }

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

        // Send payment success notification
        await this.notificationService.createFromTemplate(
            userId,
            'PAYMENT_RECEIVED',
            {
                orderNumber: order.orderNumber,
                amount: order.payment.amount,
                currency: 'VND'
            },
            orderId,
            'Order'
        );

        // Send order confirmation email
        if (order.user && order.user.email) {
            try {
                await this.mailService.sendOrderSuccessEmail(
                    order.user.email,
                    order.user.username,
                    order
                );
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
            }
        }

        return updatedPayment;
    }

    // Create payment URL for online payment gateways
    async createPaymentUrl(userId: number, orderId: number, paymentMethod: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                payment: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            },
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

        try {
            // Get the appropriate payment strategy
            const paymentStrategy = this.paymentStrategyFactory.getStrategy(paymentMethod);

            // Update payment method in the database
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: { method: paymentMethod.toUpperCase() as any }
            });

            // Generate payment URL using the strategy
            const paymentUrl = await paymentStrategy.generatePaymentUrl(order);

            return {
                paymentUrl,
                orderId: order.id,
                orderNumber: order.orderNumber,
                amount: order.total,
                paymentMethod
            };
        } catch (error) {
            throw new BadRequestException(`Error creating payment URL: ${error.message}`);
        }
    }



    // Handle callback from payment gateway
    async handlePaymentCallback(paymentMethod: string, params: any) {
        try {
            // Get the appropriate payment strategy
            const paymentStrategy = this.paymentStrategyFactory.getStrategy(paymentMethod);

            // Process the callback using the strategy
            const result = await paymentStrategy.handleCallback(params);

            // Find order based on orderNumber or other identifier in the params
            const orderIdentifier = params.orderNumber || params.vnp_TxnRef || params.invoice || params.orderId;

            if (!orderIdentifier) {
                throw new BadRequestException('Order identifier not found in callback parameters');
            }

            const order = await this.prisma.order.findFirst({
                where: {
                    OR: [
                        { orderNumber: orderIdentifier },
                        { id: parseInt(orderIdentifier, 10) || 0 }
                    ]
                },
                include: {
                    payment: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true
                        }
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    images: true,
                                }
                            },
                            productVariation: true
                        }
                    }
                },
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            // Update payment status based on callback result
            if (result.success) {
                // Update payment status to successful
                await this.prisma.payment.update({
                    where: { id: order.paymentId },
                    data: {
                        transactionId: result.transactionId,
                        status: PaymentStatus.COMPLETED,
                        metadata: result.metadata,
                    },
                });

                // Update order status
                await this.prisma.order.update({
                    where: { id: order.id },
                    data: { status: OrderStatus.CONFIRMED },
                });

                // Send payment success notification
                await this.notificationService.createFromTemplate(
                    order.userId,
                    'PAYMENT_RECEIVED',
                    {
                        orderNumber: order.orderNumber,
                        amount: order.payment.amount,
                        currency: 'VND'
                    },
                    order.id,
                    'Order'
                );

                // Send order confirmation email
                if (order.user && order.user.email) {
                    try {
                        await this.mailService.sendOrderSuccessEmail(
                            order.user.email,
                            order.user.username,
                            order
                        );
                    } catch (emailError) {
                        console.error('Failed to send order confirmation email:', emailError);
                        // Don't throw the error to avoid disrupting the payment process
                    }
                }
            } else {
                // Update payment status to failed
                await this.prisma.payment.update({
                    where: { id: order.paymentId },
                    data: {
                        transactionId: result.transactionId,
                        status: PaymentStatus.FAILED,
                        metadata: result.metadata,
                    },
                });

                // Send payment failed notification
                await this.notificationService.createFromTemplate(
                    order.userId,
                    'PAYMENT_FAILED',
                    {
                        orderNumber: order.orderNumber,
                        reason: result.message || 'Payment processing failed'
                    },
                    order.id,
                    'Order'
                );
            }

            return result;
        } catch (error) {
            throw new BadRequestException(`Error processing payment callback: ${error.message}`);
        }
    }
}