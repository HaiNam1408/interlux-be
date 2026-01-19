import { CouponService } from './coupon.service';
import { ValidateCouponDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    validateCoupon(req: any, validateCouponDto: ValidateCouponDto): Promise<ApiResponse<{
        message: string;
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
    }>>;
    getAvailableCoupons(): Promise<ApiResponse<{
        coupons: {
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
        }[];
    }>>;
}
