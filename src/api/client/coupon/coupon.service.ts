import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ValidateCouponDto } from './dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CouponService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
    ) { }

    async validateCoupon(userId: number, validateCouponDto: ValidateCouponDto) {
        const { code } = validateCouponDto;

        // Find coupon by code
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            throw new NotFoundException('Coupon code not found');
        }

        // Check if the coupon is still valid
        const now = new Date();
        if (coupon.startDate > now) {
            throw new BadRequestException('Coupon is not yet active');
        }

        if (coupon.endDate < now) {
            throw new BadRequestException('Coupon has expired');
        }

        // Check usage count
        if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
            throw new BadRequestException('Coupon has reached maximum usage limit');
        }

        // Check minimum purchase amount
        const cart = await this.cartService.getOrCreateCart(userId);
        const summary = await this.cartService.getCartSummary(cart);

        if (coupon.minPurchase && summary.subtotal < coupon.minPurchase) {
            throw new BadRequestException(`Minimum purchase amount to use this coupon is ${coupon.minPurchase}`);
        }

        // Calculate discount amount
        let discountAmount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = summary.subtotal * (coupon.value / 100);
        } else {
            discountAmount = coupon.value;
        }

        return {
            coupon,
            valid: true,
            discountAmount,
            subtotalAfterDiscount: summary.subtotal - discountAmount,
        };
    }

    async getAvailableCoupons() {
        const now = new Date();

        const coupons = await this.prisma.coupon.findMany({
            where: {
                status: 'ACTIVE',
                startDate: { lte: now },
                endDate: { gte: now },
            },
            orderBy: {
                value: 'desc',
            },
        });

        const availableCoupons = coupons.filter(coupon =>
            coupon.maxUsage === null || coupon.usageCount < coupon.maxUsage,
        );

        return availableCoupons;

    }
}