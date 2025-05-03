import { PrismaClient, CouponType, CommonStatus } from '@prisma/client';

export async function seedCoupons(prisma: PrismaClient) {
    // Delete existing data to avoid duplicates
    await prisma.coupon.deleteMany({});

    const coupons = [
        {
            code: 'WELCOME10',
            type: CouponType.PERCENTAGE,
            value: 10, // 10% discount
            minPurchase: 500000, // Minimum order value: 500k VND
            maxUsage: 1000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'SUMMER200K',
            type: CouponType.FIXED_AMOUNT,
            value: 200000, // 200k VND discount
            minPurchase: 1000000, // Minimum order value: 1M VND
            maxUsage: 500,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-09-30'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'FLASH15',
            type: CouponType.PERCENTAGE,
            value: 15, // 15% discount
            minPurchase: 300000, // Minimum order value: 300k VND
            maxUsage: 2000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-31'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'NEWCUSTOMER',
            type: CouponType.PERCENTAGE,
            value: 20, // 20% discount
            minPurchase: 1000000, // Minimum order value: 1M VND
            maxUsage: 3000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2025-01-31'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'FREESHIP',
            type: CouponType.FIXED_AMOUNT,
            value: 100000, // 100k VND discount (for shipping)
            minPurchase: 500000, // Minimum order value: 500k VND
            maxUsage: 5000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-08-15'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'SPRINGDEAL',
            type: CouponType.PERCENTAGE,
            value: 12, // 12% discount
            minPurchase: 800000, // Minimum order value: 800k VND
            maxUsage: 800,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-09-15'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'PREMIUM500K',
            type: CouponType.FIXED_AMOUNT,
            value: 500000, // 500k VND discount
            minPurchase: 5000000, // Minimum order value: 5M VND
            maxUsage: 100,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'WEEKENDSPEC',
            type: CouponType.PERCENTAGE,
            value: 8, // 8% discount
            minPurchase: 300000, // Minimum order value: 300k VND
            maxUsage: 1500,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-10-31'),
            status: CommonStatus.ACTIVE,
            usageCount: 0
        },
        {
            code: 'HOLIDAY25',
            type: CouponType.PERCENTAGE,
            value: 25, // 25% discount
            minPurchase: 2000000, // Minimum order value: 2M VND
            maxUsage: 200,
            startDate: new Date('2024-12-01'),
            endDate: new Date('2024-12-25'),
            status: CommonStatus.INACTIVE, // For future use
            usageCount: 0
        },
        {
            code: 'LOYALTY150K',
            type: CouponType.FIXED_AMOUNT,
            value: 150000, // 150k VND discount
            minPurchase: 1500000, // Minimum order value: 1.5M VND
            maxUsage: 1000,
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-12-31'),
            status: CommonStatus.ACTIVE,
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