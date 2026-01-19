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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const client_1 = require("@prisma/client");
const table_enum_1 = require("../../../common/enums/table.enum");
const notification_service_1 = require("../../../services/notification/notification.service");
let OrderService = class OrderService {
    constructor(prisma, pagination, notificationService) {
        this.prisma = prisma;
        this.pagination = pagination;
        this.notificationService = notificationService;
    }
    async findAll(page = 1, limit = 10, status, search, userId) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (userId) {
            where.userId = userId;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                {
                    user: {
                        OR: [
                            { username: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } },
                            { phone: { contains: search, mode: 'insensitive' } },
                        ]
                    }
                },
            ];
        }
        const select = {
            id: true,
            orderNumber: true,
            userId: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    phone: true,
                },
            },
            subtotal: true,
            shippingFee: true,
            tax: true,
            discount: true,
            total: true,
            status: true,
            shippingAddress: true,
            billingAddress: true,
            deliveryDate: true,
            createdAt: true,
            updatedAt: true,
            payment: {
                select: {
                    id: true,
                    method: true,
                    status: true,
                    transactionId: true,
                },
            },
            shipping: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                },
            },
            coupon: {
                select: {
                    id: true,
                    code: true,
                    value: true,
                    type: true,
                },
            },
            _count: {
                select: {
                    items: true,
                },
            },
        };
        const orderBy = [{ createdAt: 'desc' }];
        const paginate = await this.pagination.paginate(table_enum_1.TableName.ORDER, { page, limit }, where, select, orderBy);
        return paginate;
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                images: true,
                            },
                        },
                        productVariation: {
                            select: {
                                id: true,
                                sku: true,
                                price: true,
                                images: true,
                                attributeValues: {
                                    include: {
                                        attributeValue: {
                                            include: {
                                                attribute: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                payment: true,
                shipping: true,
                coupon: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(id, updateOrderStatusDto) {
        const { status, note } = updateOrderStatusDto;
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                payment: true,
                user: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot update cancelled order');
        }
        if (order.status === client_1.OrderStatus.COMPLETED && status !== client_1.OrderStatus.REFUNDED) {
            throw new common_1.BadRequestException('Cannot change status of completed order');
        }
        const updateData = { status };
        if (note) {
            updateData.note = note;
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
                user: true,
            },
        });
        let paymentStatus;
        switch (status) {
            case client_1.OrderStatus.COMPLETED:
                paymentStatus = client_1.PaymentStatus.COMPLETED;
                break;
            case client_1.OrderStatus.CANCELLED:
                paymentStatus = client_1.PaymentStatus.CANCELLED;
                break;
            case client_1.OrderStatus.RETURNED:
                paymentStatus = client_1.PaymentStatus.PROCESSING;
                break;
            case client_1.OrderStatus.REFUNDED:
                paymentStatus = client_1.PaymentStatus.REFUNDED;
                break;
            default:
                paymentStatus = client_1.PaymentStatus.PROCESSING;
        }
        if (order.paymentId) {
            await this.prisma.payment.update({
                where: { id: order.paymentId },
                data: { status: paymentStatus },
            });
        }
        if (updatedOrder.user) {
            const userId = updatedOrder.user.id;
            switch (status) {
                case client_1.OrderStatus.PROCESSING:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_CONFIRMED', { orderNumber: updatedOrder.orderNumber }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.SHIPPED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_SHIPPED', { orderNumber: updatedOrder.orderNumber }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.DELIVERED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_DELIVERED', { orderNumber: updatedOrder.orderNumber }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.COMPLETED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_COMPLETED', { orderNumber: updatedOrder.orderNumber }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.CANCELLED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_CANCELLED', {
                        orderNumber: updatedOrder.orderNumber,
                        reason: note || 'Order cancelled by admin'
                    }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.RETURNED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_RETURNED', {
                        orderNumber: updatedOrder.orderNumber,
                        reason: note || 'Order returned'
                    }, updatedOrder.id, 'Order');
                    break;
                case client_1.OrderStatus.REFUNDED:
                    await this.notificationService.createFromTemplate(userId, 'PAYMENT_REFUNDED', {
                        orderNumber: updatedOrder.orderNumber,
                        amount: updatedOrder.total,
                        currency: 'VND'
                    }, updatedOrder.id, 'Order');
                    break;
            }
        }
        if (status === client_1.OrderStatus.CANCELLED || status === client_1.OrderStatus.RETURNED || status === client_1.OrderStatus.REFUNDED) {
            for (const item of updatedOrder.items) {
                if (item.productVariationId) {
                    await this.prisma.productVariation.update({
                        where: { id: item.productVariationId },
                        data: { inventory: { increment: item.quantity } },
                    });
                }
                await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { sold: { decrement: item.quantity } },
                });
            }
            if (order.couponId) {
                await this.prisma.coupon.update({
                    where: { id: order.couponId },
                    data: { usageCount: { decrement: 1 } },
                });
            }
        }
        return updatedOrder;
    }
    async getOrderStatistics() {
        const totalOrders = await this.prisma.order.count();
        const ordersByStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });
        const statusCountMap = {};
        ordersByStatus.forEach(item => {
            statusCountMap[item.status] = item._count.id;
        });
        const revenue = await this.prisma.order.aggregate({
            where: {
                status: {
                    in: [client_1.OrderStatus.COMPLETED, client_1.OrderStatus.DELIVERED],
                },
            },
            _sum: {
                total: true,
            },
        });
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                payment: {
                    select: {
                        method: true,
                        status: true,
                    },
                },
                items: {
                    select: {
                        quantity: true,
                    },
                },
            },
        });
        return {
            totalOrders,
            totalSales: revenue._sum.total || 0,
            pendingOrders: statusCountMap[client_1.OrderStatus.PENDING] || 0,
            processingOrders: statusCountMap[client_1.OrderStatus.PROCESSING] || 0,
            shippedOrders: statusCountMap[client_1.OrderStatus.SHIPPED] || 0,
            deliveredOrders: statusCountMap[client_1.OrderStatus.DELIVERED] || 0,
            cancelledOrders: statusCountMap[client_1.OrderStatus.CANCELLED] || 0,
            completedOrders: statusCountMap[client_1.OrderStatus.COMPLETED] || 0,
            returnedOrders: statusCountMap[client_1.OrderStatus.RETURNED] || 0,
            refundedOrders: statusCountMap[client_1.OrderStatus.REFUNDED] || 0,
            recentOrders,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_util_1.PaginationService,
        notification_service_1.NotificationService])
], OrderService);
//# sourceMappingURL=order.service.js.map