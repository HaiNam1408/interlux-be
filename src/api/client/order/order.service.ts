// api/client/order/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateOrderDto } from './dto';
import { CartService } from '../cart/cart.service';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
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

        // Kiểm tra phương thức vận chuyển có tồn tại không
        const shipping = await this.prisma.shipping.findUnique({
            where: { id: shippingId },
        });

        if (!shipping) {
            throw new NotFoundException('Phương thức vận chuyển không tồn tại');
        }

        // Kiểm tra mã giảm giá nếu có
        let coupon = null;
        let discountAmount = 0;

        if (couponCode) {
            coupon = await this.prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (!coupon) {
                throw new NotFoundException('Mã giảm giá không tồn tại');
            }

            // Kiểm tra mã giảm giá còn hiệu lực không
            const now = new Date();
            if (coupon.startDate > now || coupon.endDate < now) {
                throw new BadRequestException('Mã giảm giá đã hết hạn hoặc chưa có hiệu lực');
            }

            // Kiểm tra số lần sử dụng còn lại
            if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
                throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
            }
        }

        // Lấy giỏ hàng hiện tại của user
        const cart = await this.cartService.getOrCreateCart(userId);

        // Kiểm tra giỏ hàng có sản phẩm không
        if (cart.items.length === 0) {
            throw new BadRequestException('Giỏ hàng của bạn đang trống');
        }

        // Tính tổng tiền của đơn hàng
        let subtotal = 0;
        const orderItems = [];

        // Chuẩn bị dữ liệu cho các mục đơn hàng
        for (const item of cart.items) {
            // Lấy thông tin sản phẩm và biến thể
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new NotFoundException(`Sản phẩm với ID ${item.productId} không tồn tại`);
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
                    throw new NotFoundException(`Biến thể sản phẩm với ID ${item.productVariationId} không tồn tại`);
                }

                // Kiểm tra số lượng tồn kho
                if (productVariation.inventory < item.quantity) {
                    throw new BadRequestException(`Sản phẩm "${product.title}" chỉ còn ${productVariation.inventory} sản phẩm trong kho`);
                }

                // Sử dụng giá của biến thể nếu có
                if (productVariation.price) {
                    itemPrice = productVariation.price;
                }

                // Sử dụng giảm giá của biến thể nếu có
                if (productVariation.percentOff !== null) {
                    itemDiscount = productVariation.percentOff;
                }
            }

            const discountedPrice = itemPrice * (1 - itemDiscount / 100);
            const itemTotal = discountedPrice * item.quantity;
            subtotal += itemTotal;

            // Tạo metadata cho sản phẩm
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

            // Thêm vào danh sách mục đơn hàng
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

        // Tính giảm giá từ mã coupon nếu có
        if (coupon) {
            if (coupon.type === 'PERCENTAGE') {
                discountAmount = subtotal * (coupon.value / 100);
            } else {
                discountAmount = coupon.value;
            }

            // Kiểm tra giá trị tối thiểu của đơn hàng
            if (coupon.minPurchase && subtotal < coupon.minPurchase) {
                throw new BadRequestException(`Giá trị đơn hàng tối thiểu để sử dụng mã giảm giá là ${coupon.minPurchase}`);
            }
        }

        // Tính tổng tiền cuối cùng
        const shippingFee = shipping.price;
        const tax = 0; // Có thể tính thuế nếu cần
        const total = subtotal + shippingFee + tax - discountAmount;

        // Tạo mã đơn hàng
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Khởi tạo thanh toán
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

        // Tạo đơn hàng mới
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

        // Cập nhật số lượng đã sử dụng cho mã giảm giá
        if (coupon) {
            await this.prisma.coupon.update({
                where: { id: coupon.id },
                data: { usageCount: { increment: 1 } },
            });
        }

        // Cập nhật số lượng tồn kho cho các sản phẩm
        for (const item of cart.items) {
            if (item.productVariationId) {
                await this.prisma.productVariation.update({
                    where: { id: item.productVariationId },
                    data: { inventory: { decrement: item.quantity } },
                });
            }

            // Cập nhật số lượng đã bán cho sản phẩm
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { increment: item.quantity } },
            });
        }

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        await this.cartService.clearCart(userId);

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
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền xem đơn hàng này');
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
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        if (order.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền hủy đơn hàng này');
        }

        // Chỉ có thể hủy đơn hàng ở trạng thái PENDING hoặc CONFIRMED
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
            throw new BadRequestException('Không thể hủy đơn hàng ở trạng thái hiện tại');
        }

        // Cập nhật trạng thái đơn hàng
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

        // Cập nhật trạng thái thanh toán
        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: PaymentStatus.CANCELLED },
        });

        // Hoàn trả số lượng sản phẩm vào kho
        for (const item of order.items) {
            if (item.productVariationId) {
                await this.prisma.productVariation.update({
                    where: { id: item.productVariationId },
                    data: { inventory: { increment: item.quantity } },
                });
            }

            // Giảm số lượng đã bán của sản phẩm
            await this.prisma.product.update({
                where: { id: item.productId },
                data: { sold: { decrement: item.quantity } },
            });
        }

        // Giảm số lần sử dụng mã giảm giá nếu có
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

    // Phương thức tạo đơn hàng từ Admin
    async createOrderByAdmin(adminId: number, userId: number, createOrderDto: CreateOrderDto) {
        // Kiểm tra người dùng tồn tại
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        // Sử dụng logic tạo đơn hàng tương tự như createOrder
        return this.createOrder(userId, createOrderDto);
    }

    // Phương thức cập nhật trạng thái đơn hàng từ Admin
    async updateOrderStatus(adminId: number, orderId: number, status: OrderStatus) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Đơn hàng không tồn tại');
        }

        // Kiểm tra logic chuyển trạng thái
        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestException('Không thể cập nhật đơn hàng đã hủy');
        }

        if (order.status === OrderStatus.COMPLETED && status !== OrderStatus.REFUNDED) {
            throw new BadRequestException('Không thể thay đổi trạng thái đơn hàng đã hoàn thành');
        }

        // Cập nhật trạng thái đơn hàng
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: true,
                payment: true,
                shipping: true,
                coupon: true,
            },
        });

        // Cập nhật trạng thái thanh toán tương ứng
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

        await this.prisma.payment.update({
            where: { id: order.paymentId },
            data: { status: paymentStatus },
        });

        // Xử lý hoàn trả kho nếu đơn hàng bị hủy
        if (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) {
            // Hoàn trả số lượng sản phẩm vào kho
            for (const item of updatedOrder.items) {
                if (item.productVariationId) {
                    await this.prisma.productVariation.update({
                        where: { id: item.productVariationId },
                        data: { inventory: { increment: item.quantity } },
                    });
                }

                // Giảm số lượng đã bán của sản phẩm
                await this.prisma.product.update({
                    where: { id: item.productId },
                    data: { sold: { decrement: item.quantity } },
                });
            }

            // Giảm số lần sử dụng mã giảm giá nếu có
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