import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(req: any, createOrderDto: CreateOrderDto): Promise<ApiResponse<{
        order: {
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
        };
        message: string;
    }>>;
    getOrders(req: any): Promise<ApiResponse<{
        orders: ({
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
        })[];
    }>>;
    getOrderDetail(req: any, id: string): Promise<ApiResponse<{
        order: {
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
        };
    }>>;
    cancelOrder(req: any, id: string): Promise<ApiResponse<{
        order: {
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
        };
        message: string;
    }>>;
    getShippingMethods(): Promise<ApiResponse<{
        shippingMethods: {
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
        }[];
    }>>;
}
