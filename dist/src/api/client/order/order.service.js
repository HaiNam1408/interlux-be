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
const cart_service_1 = require("../cart/cart.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../../../services/notification/notification.service");
let OrderService = class OrderService {
    constructor(prisma, cartService, notificationService) {
        this.prisma = prisma;
        this.cartService = cartService;
        this.notificationService = notificationService;
    }
    async createOrder(userId, createOrderDto) {
        const { shippingAddress, billingAddress, shippingId, paymentMethod, couponCode, note, } = createOrderDto;
        const shipping = await this.prisma.shipping.findUnique({
            where: { id: shippingId },
        });
        if (!shipping) {
            throw new common_1.NotFoundException('Shipping method not found');
        }
        let coupon = null;
        let discountAmount = 0;
        if (couponCode) {
            coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode },
            });
            if (!coupon) {
                throw new common_1.NotFoundException('Coupon code not found');
            }
            const now = new Date();
            if (coupon.startDate > now || coupon.endDate < now) {
                throw new common_1.BadRequestException('Coupon has expired or is not yet active');
            }
            if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
                throw new common_1.BadRequestException('Coupon has reached maximum usage limit');
            }
        }
        const cart = await this.cartService.getOrCreateCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Your cart is empty');
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of cart.items || []) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            let itemPrice = product.price;
            let itemDiscount = product.percentOff || 0;
            let productVariation = null;
            if (item.productVariationId) {
                productVariation = await this.prisma.productVariation.findUnique({
                    where: { id: item.productVariationId },
                    include: {
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
                });
                if (!productVariation) {
                    throw new common_1.NotFoundException(`Product variation with ID ${item.productVariationId} not found`);
                }
                if (productVariation.inventory < item.quantity) {
                    throw new common_1.BadRequestException(`Product "${product.title}" only has ${productVariation.inventory} items in stock`);
                }
                if (productVariation.price) {
                    itemPrice = productVariation.price;
                }
                if (productVariation.percentOff !== null) {
                    itemDiscount = productVariation.percentOff;
                }
            }
            const discountedPrice = itemPrice * (1 - itemDiscount / 100);
            const itemTotal = discountedPrice * item.quantity;
            subtotal += itemTotal;
            const productMetadata = {
                title: product.title,
                slug: product.slug,
                images: product.images,
                attributes: product.attributes,
            };
            let variationMetadata = null;
            if (productVariation) {
                variationMetadata = {
                    sku: productVariation.sku,
                    images: productVariation.images,
                    attributes: productVariation.attributeValues ?
                        productVariation.attributeValues.map(av => ({
                            name: av.attributeValue?.attribute?.name || 'Unknown',
                            value: av.attributeValue?.name || 'Unknown',
                        })) : [],
                };
            }
            orderItems.push({
                productId: item.productId,
                productVariationId: item.productVariationId || null,
                quantity: item.quantity,
                price: itemPrice,
                discount: itemDiscount,
                total: itemTotal,
                metadata: {
                    product: productMetadata,
                    variation: variationMetadata,
                },
            });
        }
        if (coupon) {
            if (coupon.type === 'PERCENTAGE') {
                discountAmount = subtotal * (coupon.value / 100);
            }
            else {
                discountAmount = coupon.value;
            }
            if (coupon.minPurchase && subtotal < coupon.minPurchase) {
                throw new common_1.BadRequestException(`Minimum purchase amount to use this coupon is ${coupon.minPurchase}`);
            }
        }
        const shippingFee = shipping.price;
        const tax = 0;
        const total = subtotal + shippingFee + tax - discountAmount;
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const payment = await this.prisma.payment.create({
            data: {
                amount: total,
                method: paymentMethod,
                status: client_1.PaymentStatus.PENDING,
                currency: 'VND',
                metadata: {
                    orderNumber,
                    userId,
                    createdAt: new Date(),
                },
            },
        });
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                subtotal,
                shippingFee,
                tax,
                discount: discountAmount,
                total,
                paymentId: payment.id,
                shippingId,
                couponId: coupon?.id,
                status: client_1.OrderStatus.PENDING,
                note,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress || shippingAddress,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
        });
        if (coupon) {
            await this.prisma.coupon.update({
                where: { id: coupon.id },
                data: { usageCount: { increment: 1 } },
            });
        }
        for (const item of cart.items || []) {
            if (item.productVariationId) {
                await this.prisma.productVariation.update({
                    where: { id: item.productVariationId },
                    data: { inventory: { decrement: item.quantity } },
                });
            }
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { increment: item.quantity } },
            });
        }
        await this.cartService.clearCart(userId);
        await this.notificationService.createFromTemplate(userId, 'ORDER_CREATED', {
            orderNumber: order.orderNumber,
            total: order.total,
            currency: 'VND'
        }, order.id, 'Order');
        return order;
    }
    async getOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOrderDetail(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to view this order');
        }
        return order;
    }
    async cancelOrder(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                payment: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to cancel this order');
        }
        if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Cannot cancel order in current status');
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: client_1.OrderStatus.CANCELLED },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
        });
        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: client_1.PaymentStatus.CANCELLED },
        });
        for (const item of order.items) {
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
        return updatedOrder;
    }
    async getShippingMethods() {
        return this.prisma.shipping.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { price: 'asc' },
        });
    }
    async createOrderByAdmin(adminId, userId, createOrderDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.createOrder(userId, createOrderDto);
    }
    async updateOrderStatus(adminId, orderId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
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
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
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
            case client_1.OrderStatus.REFUNDED:
                paymentStatus = client_1.PaymentStatus.REFUNDED;
                break;
            default:
                paymentStatus = client_1.PaymentStatus.PROCESSING;
        }
        if (updatedOrder.user) {
            const userId = updatedOrder.user.id;
            switch (status) {
                case client_1.OrderStatus.PROCESSING:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_CONFIRMED', { orderNumber: updatedOrder.orderNumber }, orderId, 'Order');
                    break;
                case client_1.OrderStatus.SHIPPED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_SHIPPED', { orderNumber: updatedOrder.orderNumber }, orderId, 'Order');
                    break;
                case client_1.OrderStatus.COMPLETED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_DELIVERED', { orderNumber: updatedOrder.orderNumber }, orderId, 'Order');
                    break;
                case client_1.OrderStatus.CANCELLED:
                    await this.notificationService.createFromTemplate(userId, 'ORDER_CANCELLED', {
                        orderNumber: updatedOrder.orderNumber,
                        reason: 'Order cancelled by admin'
                    }, orderId, 'Order');
                    break;
                case client_1.OrderStatus.REFUNDED:
                    await this.notificationService.createFromTemplate(userId, 'PAYMENT_REFUNDED', {
                        orderNumber: updatedOrder.orderNumber,
                        amount: updatedOrder.total,
                        currency: 'VND'
                    }, orderId, 'Order');
                    break;
            }
        }
        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: paymentStatus },
        });
        if (status === client_1.OrderStatus.CANCELLED || status === client_1.OrderStatus.REFUNDED) {
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService,
        notification_service_1.NotificationService])
], OrderService);
//# sourceMappingURL=order.service.js.map