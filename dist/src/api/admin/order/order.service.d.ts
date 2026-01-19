import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { NotificationService } from 'src/services/notification/notification.service';
export interface OrderStatistics {
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
    refundedOrders: number;
    completedOrders: number;
    recentOrders: any[];
}
export declare class OrderService {
    private readonly prisma;
    private readonly pagination;
    private readonly notificationService;
    constructor(prisma: PrismaService, pagination: PaginationService, notificationService: NotificationService);
    findAll(page?: number, limit?: number, status?: OrderStatus, search?: string, userId?: number): Promise<import("../../../common/interfaces/paginated.interface").PaginatedResult<unknown>>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            username: string;
            email: string;
            phone: string;
            avatar: import("@prisma/client/runtime/library").JsonValue;
        };
        payment: {
            currency: string;
            amount: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.PaymentStatus;
            transactionId: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
        };
        shipping: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CommonStatus;
            price: number;
            estimatedDays: number | null;
            provider: string | null;
            trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        };
        coupon: {
            id: number;
            type: import(".prisma/client").$Enums.CouponType;
            createdAt: Date;
            updatedAt: Date;
            value: number;
            status: import(".prisma/client").$Enums.CommonStatus;
            code: string;
            minPurchase: number | null;
            maxUsage: number | null;
            startDate: Date;
            endDate: Date;
            usageCount: number;
        };
        items: ({
            product: {
                title: string;
                id: number;
                slug: string;
                images: import("@prisma/client/runtime/library").JsonValue;
            };
            productVariation: {
                id: number;
                price: number;
                images: import("@prisma/client/runtime/library").JsonValue;
                sku: string;
                attributeValues: ({
                    attributeValue: {
                        attribute: {
                            id: number;
                            createdAt: Date;
                            updatedAt: Date;
                            name: string;
                            sort: number | null;
                            slug: string;
                            status: import(".prisma/client").$Enums.CommonStatus;
                            productId: number;
                        };
                    } & {
                        id: number;
                        createdAt: Date;
                        updatedAt: Date;
                        name: string;
                        sort: number | null;
                        value: string | null;
                        slug: string;
                        status: import(".prisma/client").$Enums.CommonStatus;
                        attributeId: number;
                    };
                } & {
                    id: number;
                    productVariationId: number;
                    attributeValueId: number;
                })[];
            };
        } & {
            total: number;
            discount: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            price: number;
            productId: number;
            productVariationId: number | null;
            quantity: number;
            orderId: number;
        })[];
    } & {
        orderNumber: string;
        total: number;
        discount: number;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        shippingFee: number;
        tax: number;
        paymentId: number | null;
        shippingId: number | null;
        couponId: number | null;
        note: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        deliveryDate: Date | null;
    }>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.CommonStatus;
            username: string;
            email: string;
            phone: string;
            password: string;
            avatar: import("@prisma/client/runtime/library").JsonValue | null;
            address: string | null;
            role: import(".prisma/client").$Enums.Role;
            refreshToken: string | null;
        };
        payment: {
            currency: string;
            amount: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            status: import(".prisma/client").$Enums.PaymentStatus;
            transactionId: string | null;
            method: import(".prisma/client").$Enums.PaymentMethod;
        };
        shipping: {
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CommonStatus;
            price: number;
            estimatedDays: number | null;
            provider: string | null;
            trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
        };
        coupon: {
            id: number;
            type: import(".prisma/client").$Enums.CouponType;
            createdAt: Date;
            updatedAt: Date;
            value: number;
            status: import(".prisma/client").$Enums.CommonStatus;
            code: string;
            minPurchase: number | null;
            maxUsage: number | null;
            startDate: Date;
            endDate: Date;
            usageCount: number;
        };
        items: {
            total: number;
            discount: number;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            price: number;
            productId: number;
            productVariationId: number | null;
            quantity: number;
            orderId: number;
        }[];
    } & {
        orderNumber: string;
        total: number;
        discount: number;
        id: number;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        shippingFee: number;
        tax: number;
        paymentId: number | null;
        shippingId: number | null;
        couponId: number | null;
        note: string | null;
        shippingAddress: import("@prisma/client/runtime/library").JsonValue;
        billingAddress: import("@prisma/client/runtime/library").JsonValue | null;
        deliveryDate: Date | null;
    }>;
    getOrderStatistics(): Promise<OrderStatistics>;
}
