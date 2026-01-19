import { CouponType, CommonStatus } from '@prisma/client';
export declare class CreateCouponDto {
    code: string;
    type: CouponType;
    value: number;
    minPurchase?: number;
    maxUsage?: number;
    startDate: string;
    endDate: string;
    status?: CommonStatus;
}
