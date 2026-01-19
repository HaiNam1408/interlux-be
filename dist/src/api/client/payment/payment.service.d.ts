import { PrismaService } from '../../../prisma.service';
import { VerifyPaymentDto } from './dto';
import { PaymentStrategyFactory } from './strategies';
import { NotificationService } from 'src/services/notification/notification.service';
export declare class PaymentService {
    private prisma;
    private paymentStrategyFactory;
    private notificationService;
    constructor(prisma: PrismaService, paymentStrategyFactory: PaymentStrategyFactory, notificationService: NotificationService);
    getPaymentDetail(userId: number, paymentId: number): Promise<{
        orders: ({
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
    } & {
        currency: string;
        amount: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
        transactionId: string | null;
        method: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    verifyPayment(userId: number, verifyPaymentDto: VerifyPaymentDto): Promise<{
        currency: string;
        amount: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        status: import(".prisma/client").$Enums.PaymentStatus;
        transactionId: string | null;
        method: import(".prisma/client").$Enums.PaymentMethod;
    }>;
    createPaymentUrl(userId: number, orderId: number, paymentMethod: string): Promise<{
        paymentUrl: string;
        orderId: number;
        orderNumber: string;
        amount: number;
        paymentMethod: string;
    }>;
    handlePaymentCallback(paymentMethod: string, params: any): Promise<{
        success: boolean;
        transactionId?: string;
        message: string;
        metadata?: any;
    }>;
}
