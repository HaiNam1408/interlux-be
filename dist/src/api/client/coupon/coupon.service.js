"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const cart_service_1 = require("../cart/cart.service");
let CouponService = class CouponService {
    constructor(prisma, cartService) {
        this.prisma = prisma;
        this.cartService = cartService;
    }
    async validateCoupon(userId, validateCouponDto) {
        const { code } = validateCouponDto;
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon code not found');
        }
        const now = new Date();
        if (coupon.startDate > now) {
            throw new common_1.BadRequestException('Coupon is not yet active');
        }
        if (coupon.endDate < now) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
            throw new common_1.BadRequestException('Coupon has reached maximum usage limit');
        }
        const cart = await this.cartService.getOrCreateCart(userId);
        const summary = await this.cartService.getCartSummary(cart);
        if (coupon.minPurchase && summary.subtotal < coupon.minPurchase) {
            throw new common_1.BadRequestException(`Minimum purchase amount to use this coupon is ${coupon.minPurchase}`);
        }
        let discountAmount = 0;
        if (coupon.type === 'PERCENTAGE') {
            discountAmount = summary.subtotal * (coupon.value / 100);
        }
        else {
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
        const availableCoupons = coupons.filter(coupon => coupon.maxUsage === null || coupon.usageCount < coupon.maxUsage);
        return availableCoupons;
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService])
], CouponService);
//# sourceMappingURL=coupon.service.js.map