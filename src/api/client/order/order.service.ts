import { MailService } from './../../../services/mail/mail.service';
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
        private mailService: MailService
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

        const shipping = await this.prisma.shipping.findUnique({
            where: { id: shippingId },
        });

        if (!shipping) {
            throw new NotFoundException('Shipping method not found');
        }

        let coupon = null;
        let discountAmount = 0;

        if (couponCode) {
            coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (!coupon) {
                throw new NotFoundException('Coupon code not found');
            }

            const now = new Date();
            if (coupon.startDate > now || coupon.endDate < now) {
                throw new BadRequestException('Coupon has expired or is not yet active');
            }

            if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
                throw new BadRequestException('Coupon has reached maximum usage limit');
            }
        }

        const cart = await this.cartService.getOrCreateCart(userId);

        if (!cart.items || cart.items.length === 0) {
            throw new BadRequestException('Your cart is empty');
        }

        // Calculate order total
        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items || []) {
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
                    throw new NotFoundException(`Product variation with ID ${item.productVariationId} not found`);
                }

                if (productVariation.inventory < item.quantity) {
                    throw new BadRequestException(`Product "${product.title}" only has ${productVariation.inventory} items in stock`);
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

            // Create product metadata
            const productMetadata = {
                title: product.title,
                slug: product.slug,
                images: product.images,
                price: product.price,
                percentOff: product.percentOff,
                attributes: product.attributes,
            };

            let variationMetadata = null;
            if (productVariation) {
                variationMetadata = {
                    sku: productVariation.sku,
                    images: productVariation.images,
                    price: productVariation.price,
                    percentOff: productVariation.percentOff,
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
            } else {
                discountAmount = coupon.value;
            }

            if (coupon.minPurchase && subtotal < coupon.minPurchase) {
                throw new BadRequestException(`Minimum purchase amount to use this coupon is ${coupon.minPurchase}`);
            }
        }

        const shippingFee = shipping.price;
        const total = subtotal + shippingFee - discountAmount;
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

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

        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                subtotal,
                shippingFee,
                discount: discountAmount,
                total,
                paymentId: payment.id,
                shippingId,
                couponId: coupon?.id,
                status: paymentMethod == PaymentMethod.COD ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
                note,
                shippingAddress: shippingAddress as any,
                billingAddress: billingAddress as any || shippingAddress as any,
                items: {
                    create: orderItems,
                },
            },
            include: {
                user: true,
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

        if (paymentMethod == PaymentMethod.COD) {
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

            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { decrement: item.quantity } },
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
}