"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
const strategies_1 = require("./strategies");
const notification_service_1 = require("../../../services/notification/notification.service");
let PaymentService = class PaymentService {
    constructor(prisma, paymentStrategyFactory, notificationService) {
        this.prisma = prisma;
        this.paymentStrategyFactory = paymentStrategyFactory;
        this.notificationService = notificationService;
    }
    async getPaymentDetail(userId, paymentId) {
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
            throw new common_1.NotFoundException('Payment not found');
        }
        const hasAccess = payment.orders.some((order) => order.userId === userId);
        if (!hasAccess) {
            throw new common_1.BadRequestException('You do not have permission to access this payment information');
        }
        return payment;
    }
    async verifyPayment(userId, verifyPaymentDto) {
        const { orderId, transactionId, metadata } = verifyPaymentDto;
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { payment: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to update this payment information');
        }
        if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.PROCESSING) {
            throw new common_1.BadRequestException('Cannot update payment information for this order');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: {
                transactionId,
                status: client_1.PaymentStatus.COMPLETED,
                metadata: JSON.parse(metadata),
            },
        });
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.CONFIRMED },
        });
        return updatedPayment;
    }
    async createPaymentUrl(userId, orderId, paymentMethod) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to create payment URL for this order');
        }
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Cannot create payment URL for this order');
        }
        try {
            const paymentStrategy = this.paymentStrategyFactory.getStrategy(paymentMethod);
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: { method: paymentMethod.toUpperCase() }
            });
            const paymentUrl = await paymentStrategy.generatePaymentUrl(order);
            return {
                paymentUrl,
                orderId: order.id,
                orderNumber: order.orderNumber,
                amount: order.total,
                paymentMethod
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error creating payment URL: ${error.message}`);
        }
    }
    async handlePaymentCallback(paymentMethod, params) {
        try {
            const paymentStrategy = this.paymentStrategyFactory.getStrategy(paymentMethod);
            const result = await paymentStrategy.handleCallback(params);
            const orderIdentifier = params.orderNumber || params.vnp_TxnRef || params.invoice || params.orderId;
            if (!orderIdentifier) {
                throw new common_1.BadRequestException('Order identifier not found in callback parameters');
            }
            const order = await this.prisma.order.findFirst({
                where: {
                    OR: [
                        { orderNumber: orderIdentifier },
                        { id: parseInt(orderIdentifier, 10) || 0 }
                    ]
                },
                include: { payment: true },
            });
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            if (result.success) {
                await this.prisma.payment.update({
                    where: { id: order.paymentId },
                    data: {
                        transactionId: result.transactionId,
                        status: client_1.PaymentStatus.COMPLETED,
                        metadata: result.metadata,
                    },
                });
                await this.prisma.order.update({
                    where: { id: order.id },
                    data: { status: client_1.OrderStatus.CONFIRMED },
                });
                await this.notificationService.createFromTemplate(order.userId, 'PAYMENT_RECEIVED', {
                    orderNumber: order.orderNumber,
                    amount: order.payment.amount,
                    currency: 'VND'
                }, order.id, 'Order');
            }
            else {
                await this.prisma.payment.update({
                    where: { id: order.paymentId },
                    data: {
                        transactionId: result.transactionId,
                        status: client_1.PaymentStatus.FAILED,
                        metadata: result.metadata,
                    },
                });
                await this.notificationService.createFromTemplate(order.userId, 'PAYMENT_FAILED', {
                    orderNumber: order.orderNumber,
                    reason: result.message || 'Payment processing failed'
                }, order.id, 'Order');
            }
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error processing payment callback: ${error.message}`);
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        strategies_1.PaymentStrategyFactory,
        notification_service_1.NotificationService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map