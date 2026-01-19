"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCoupons = seedCoupons;
const client_1 = require("@prisma/client");
async function seedCoupons(prisma) {
    await prisma.coupon.deleteMany({});
    const coupons = [
        {
            code: 'WELCOME10',
            type: client_1.CouponType.PERCENTAGE,
            value: 10,
            minPurchase: 500000,
            maxUsage: 1000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'SUMMER200K',
            type: client_1.CouponType.FIXED_AMOUNT,
            value: 200000,
            minPurchase: 1000000,
            maxUsage: 500,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-09-30'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'FLASH15',
            type: client_1.CouponType.PERCENTAGE,
            value: 15,
            minPurchase: 300000,
            maxUsage: 2000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'NEWCUSTOMER',
            type: client_1.CouponType.PERCENTAGE,
            value: 20,
            minPurchase: 1000000,
            maxUsage: 3000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2025-01-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'FREESHIP',
            type: client_1.CouponType.FIXED_AMOUNT,
            value: 100000,
            minPurchase: 500000,
            maxUsage: 5000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-08-15'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'SPRINGDEAL',
            type: client_1.CouponType.PERCENTAGE,
            value: 12,
            minPurchase: 800000,
            maxUsage: 800,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-09-15'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'PREMIUM500K',
            type: client_1.CouponType.FIXED_AMOUNT,
            value: 500000,
            minPurchase: 5000000,
            maxUsage: 100,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'WEEKENDSPEC',
            type: client_1.CouponType.PERCENTAGE,
            value: 8,
            minPurchase: 300000,
            maxUsage: 1500,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-10-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'HOLIDAY25',
            type: client_1.CouponType.PERCENTAGE,
            value: 25,
            minPurchase: 2000000,
            maxUsage: 200,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-25'),
            status: client_1.CommonStatus.INACTIVE,
            usageCount: 0
        },
        {
            code: 'LOYALTY150K',
            type: client_1.CouponType.FIXED_AMOUNT,
            value: 150000,
            minPurchase: 1500000,
            maxUsage: 1000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: client_1.CommonStatus.ACTIVE,
            usageCount: 0
        }
    ];
    for (const coupon of coupons) {
        await prisma.coupon.create({
            data: coupon
        });
    }
    console.log(`Created ${coupons.length} coupons`);
}
//# sourceMappingURL=06-coupons.js.map