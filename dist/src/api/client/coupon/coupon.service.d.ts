import { PrismaService } from '../../../prisma.service';
import { ValidateCouponDto } from './dto';
import { CartService } from '../cart/cart.service';
export declare class CouponService {
    private prisma;
    private cartService;
    constructor(prisma: PrismaService, cartService: CartService);
    validateCoupon(userId: number, validateCouponDto: ValidateCouponDto): Promise<{
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
        valid: boolean;
        discountAmount: number;
        subtotalAfterDiscount: number;
    }>;
    getAvailableCoupons(): Promise<{
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
    }[]>;
}
