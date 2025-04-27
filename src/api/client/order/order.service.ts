// api/client/order/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateOrderDto } from './dto';
import { CartService } from '../cart/cart.service';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { NotificationService } from 'src/services/notification/notification.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
        private notificationService: NotificationService,
    ) { }

    async createOrder(userId: number, createOrderDto: CreateOrderDto) {
        const {
            shippingAddress,
            billingAddress,
            shippingId,
            paymentMethod,
            couponCode,
            note,
        } = createOrderDto;

        // Check if shipping method exists
        const shipping = await this.prisma.shipping.findUnique({
            where: { id: shippingId },
        });

        if (!shipping) {
            throw new NotFoundException('Shipping method not found');
        }

        // Check coupon code if provided
        let coupon = null;
        let discountAmount = 0;

        if (couponCode) {
            coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (!coupon) {
                throw new NotFoundException('Coupon code not found');
            }

            // Check if coupon is still valid
            const now = new Date();
            if (coupon.startDate > now || coupon.endDate < now) {
                throw new BadRequestException('Coupon has expired or is not yet active');
            }

            // Check remaining usage count
            if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
                throw new BadRequestException('Coupon has reached maximum usage limit');
            }
        }

        // Get user's current cart
        const cart = await this.cartService.getOrCreateCart(userId);

        // Check if cart has products
        if (cart.items.length === 0) {
            throw new BadRequestException('Your cart is empty');
        }

        // Calculate order total
        let subtotal = 0;
        const orderItems = [];

        // Prepare data for order items
        for (const item of cart.items) {
            // Get product and variation information
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }

            let itemPrice = product.price;
            let itemDiscount = product.percentOff || 0;
            let productVariation = null;

            if (item.productVariationId) {
                productVariation = await this.prisma.productVariation.findUnique({
                    where: { id: item.productVariationId },
                    include: {
                        options: {
                            include: {
                                variationOption: {
                                    include: {
                                        variation: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (!productVariation) {
                    throw new NotFoundException(`Product variation with ID ${item.productVariationId} not found`);
                }

                // Check inventory
                if (productVariation.inventory < item.quantity) {
                    throw new BadRequestException(`Product "${product.title}" only has ${productVariation.inventory} items in stock`);
                }

                // Use variation price if available
                if (productVariation.price) {
                    itemPrice = productVariation.price;
                }

                // Use variation discount if available
                if (productVariation.percentOff !== null) {
                    itemDiscount = productVariation.percentOff;
                }
            }

            const discountedPrice = itemPrice * (1 - itemDiscount / 100);
            const itemTotal = discountedPrice * item.quantity;
            subtotal += itemTotal;

            // Create product metadata
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
                    options: productVariation.options.map(option => ({
                        name: option.variationOption.variation.name,
                        value: option.variationOption.name,
                    })),
                };
            }

            // Add to order items list
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

        // Calculate discount from coupon if available
        if (coupon) {
            if (coupon.type === 'PERCENTAGE') {
                discountAmount = subtotal * (coupon.value / 100);
            } else {
                discountAmount = coupon.value;
            }

            // Check minimum purchase requirement
            if (coupon.minPurchase && subtotal < coupon.minPurchase) {
                throw new BadRequestException(`Minimum purchase amount to use this coupon is ${coupon.minPurchase}`);
            }
        }

        // Calculate final total
        const shippingFee = shipping.price;
        const tax = 0; // Can calculate tax if needed
        const total = subtotal + shippingFee + tax - discountAmount;

        // Create order number
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Initialize payment
        const payment = await this.prisma.payment.create({
            data: {
                amount: total,
                method: paymentMethod as PaymentMethod,
                status: PaymentStatus.PENDING,
                currency: 'VND',
                metadata: {
                    orderNumber,
                    userId,
                    createdAt: new Date(),
                },
            },
        });

        // Create new order
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
                status: OrderStatus.PENDING,
                note,
                shippingAddress: shippingAddress as any,
                billingAddress: billingAddress as any || shippingAddress as any,
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

        // Update coupon usage count
        if (coupon) {
            await this.prisma.coupon.update({
                where: { id: coupon.id },
                data: { usageCount: { increment: 1 } },
            });
        }

        // Update product inventory
        for (const item of cart.items) {
            if (item.productVariationId) {
                await this.prisma.productVariation.update({
                    where: { id: item.productVariationId },
                    data: { inventory: { decrement: item.quantity } },
                });
            }

            // Update product sold count
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { increment: item.quantity } },
            });
        }

        // Clear cart after successful order creation
        await this.cartService.clearCart(userId);

        // Send order created notification
        await this.notificationService.createFromTemplate(
            userId,
            'ORDER_CREATED',
            {
                orderNumber: order.orderNumber,
                total: order.total,
                currency: 'VND'
            },
            order.id,
            'Order'
        );

        return order;
    }

    async getOrders(userId: number) {
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

    async getOrderDetail(userId: number, orderId: number) {
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
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('You do not have permission to view this order');
        }

        return order;
    }

    async cancelOrder(userId: number, orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                payment: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('You do not have permission to cancel this order');
        }

        // Can only cancel orders in PENDING or CONFIRMED status
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
            throw new BadRequestException('Cannot cancel order in current status');
        }

        // Update order status
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
        });

        // Update payment status
        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: PaymentStatus.CANCELLED },
        });

        // Return products to inventory
        for (const item of order.items) {
            if (item.productVariationId) {
                await this.prisma.productVariation.update({
                    where: { id: item.productVariationId },
                    data: { inventory: { increment: item.quantity } },
                });
            }

            // Decrease product sold count
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { decrement: item.quantity } },
            });
        }

        // Decrease coupon usage count if applicable
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

    // Method to create order from Admin
    async createOrderByAdmin(adminId: number, userId: number, createOrderDto: CreateOrderDto) {
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Use the same order creation logic as createOrder
        return this.createOrder(userId, createOrderDto);
    }

    // Method to update order status from Admin
    async updateOrderStatus(adminId: number, orderId: number, status: OrderStatus) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Check status transition logic
        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Cannot update cancelled order');
        }

        if (order.status === OrderStatus.COMPLETED && status !== OrderStatus.REFUNDED) {
            throw new BadRequestException('Cannot change status of completed order');
        }

        // Update order status
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

        // Update corresponding payment status
        let paymentStatus: PaymentStatus;
        switch (status) {
            case OrderStatus.COMPLETED:
                paymentStatus = PaymentStatus.COMPLETED;
                break;
            case OrderStatus.CANCELLED:
                paymentStatus = PaymentStatus.CANCELLED;
                break;
            case OrderStatus.REFUNDED:
                paymentStatus = PaymentStatus.REFUNDED;
                break;
            default:
                paymentStatus = PaymentStatus.PROCESSING;
        }

        // Send notification based on the new status
        if (updatedOrder.user) {
            const userId = updatedOrder.user.id;

            switch (status) {
                case OrderStatus.PROCESSING:
                    await this.notificationService.createFromTemplate(
                        userId,
                        'ORDER_CONFIRMED',
                        { orderNumber: updatedOrder.orderNumber },
                        orderId,
                        'Order'
                    );
                    break;
                case OrderStatus.SHIPPED:
                    await this.notificationService.createFromTemplate(
                        userId,
                        'ORDER_SHIPPED',
                        { orderNumber: updatedOrder.orderNumber },
                        orderId,
                        'Order'
                    );
                    break;
                case OrderStatus.COMPLETED:
                    await this.notificationService.createFromTemplate(
                        userId,
                        'ORDER_DELIVERED',
                        { orderNumber: updatedOrder.orderNumber },
                        orderId,
                        'Order'
                    );
                    break;
                case OrderStatus.CANCELLED:
                    await this.notificationService.createFromTemplate(
                        userId,
                        'ORDER_CANCELLED',
                        {
                            orderNumber: updatedOrder.orderNumber,
                            reason: 'Order cancelled by admin'
                        },
                        orderId,
                        'Order'
                    );
                    break;
                case OrderStatus.REFUNDED:
                    await this.notificationService.createFromTemplate(
                        userId,
                        'PAYMENT_REFUNDED',
                        {
                            orderNumber: updatedOrder.orderNumber,
                            amount: updatedOrder.total,
                            currency: 'VND'
                        },
                        orderId,
                        'Order'
                    );
                    break;
            }
        }

        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: paymentStatus },
        });

        // Process inventory return if order is cancelled
        if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) {
            // Return products to inventory
            for (const item of updatedOrder.items) {
                if (item.productVariationId) {
                    await this.prisma.productVariation.update({
                        where: { id: item.productVariationId },
                        data: { inventory: { increment: item.quantity } },
                    });
                }

                // Decrease product sold count
                await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { sold: { decrement: item.quantity } },
                });
            }

            // Decrease coupon usage count if applicable
            if (order.couponId) {
                await this.prisma.coupon.update({
                    where: { id: order.couponId },
                    data: { usageCount: { decrement: 1 } },
                });
            }
        }

        return updatedOrder;
    }
}