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

        // Tìm mã giảm giá theo code
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            throw new NotFoundException('Mã giảm giá không tồn tại');
        }

        // Kiểm tra xem mã giảm giá còn hiệu lực không
        const now = new Date();
        if (coupon.startDate > now) {
            throw new BadRequestException('Mã giảm giá chưa có hiệu lực');
        }

        if (coupon.endDate < now) {
            throw new BadRequestException('Mã giảm giá đã hết hạn');
        }

        // Kiểm tra số lần sử dụng
        if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
            throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        const cart = await this.cartService.getOrCreateCart(userId);
        const summary = await this.cartService.getCartSummary(cart);

        if (coupon.minPurchase && summary.subtotal < coupon.minPurchase) {
            throw new BadRequestException(`Giá trị đơn hàng tối thiểu để sử dụng mã giảm giá là ${coupon.minPurchase}`);
        }

        // Tính toán giá trị giảm giá
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