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
const pagination_util_1 = require("../../../utils/pagination.util");
const table_enum_1 = require("../../../common/enums/table.enum");
const notification_service_1 = require("../../../services/notification/notification.service");
let CouponService = class CouponService {
    constructor(prismaService, pagination, notificationService) {
        this.prismaService = prismaService;
        this.pagination = pagination;
        this.notificationService = notificationService;
    }
    async findAll(page = 1, limit = 10, status) {
        const where = status ? { status } : {};
        const select = {
            id: true,
            code: true,
            type: true,
            value: true,
            minPurchase: true,
            maxUsage: true,
            usageCount: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,
            updatedAt: true
        };
        const orderBy = [{ createdAt: 'desc' }];
        const paginate = await this.pagination.paginate(table_enum_1.TableName.COUPON, { page, limit }, where, select, orderBy);
        return paginate;
    }
    async findOne(id) {
        const coupon = await this.prismaService.coupon.findUnique({
            where: { id }
        });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        }
        return coupon;
    }
    async findByCode(code) {
        const coupon = await this.prismaService.coupon.findUnique({
            where: { code }
        });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with code "${code}" not found`);
        }
        return coupon;
    }
    async create(createCouponDto) {
        const codeExists = await this.prismaService.coupon.findUnique({
            where: { code: createCouponDto.code }
        });
        if (codeExists) {
            throw new common_1.BadRequestException(`Coupon with code "${createCouponDto.code}" already exists`);
        }
        if (new Date(createCouponDto.startDate) >= new Date(createCouponDto.endDate)) {
            throw new common_1.BadRequestException('End date must be later than start date');
        }
        const coupon = await this.prismaService.coupon.create({
            data: createCouponDto
        });
        return coupon;
    }
    async update(id, updateCouponDto) {
        const couponExists = await this.prismaService.coupon.findUnique({
            where: { id }
        });
        if (!couponExists) {
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        }
        if (updateCouponDto.code && updateCouponDto.code !== couponExists.code) {
            const codeExists = await this.prismaService.coupon.findUnique({
                where: { code: updateCouponDto.code }
            });
            if (codeExists) {
                throw new common_1.BadRequestException(`Coupon with code "${updateCouponDto.code}" already exists`);
            }
        }
        if (updateCouponDto.startDate && updateCouponDto.endDate) {
            if (new Date(updateCouponDto.startDate) >= new Date(updateCouponDto.endDate)) {
                throw new common_1.BadRequestException('End date must be later than start date');
            }
        }
        else if (updateCouponDto.startDate && !updateCouponDto.endDate) {
            if (new Date(updateCouponDto.startDate) >= new Date(couponExists.endDate)) {
                throw new common_1.BadRequestException('Start date must be earlier than end date');
            }
        }
        else if (!updateCouponDto.startDate && updateCouponDto.endDate) {
            if (new Date(couponExists.startDate) >= new Date(updateCouponDto.endDate)) {
                throw new common_1.BadRequestException('End date must be later than start date');
            }
        }
        const updatedCoupon = await this.prismaService.coupon.update({
            where: { id },
            data: updateCouponDto
        });
        return updatedCoupon;
    }
    async remove(id) {
        const coupon = await this.prismaService.coupon.findUnique({
            where: { id }
        });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        }
        const activeOrders = await this.prismaService.order.count({
            where: {
                couponId: id,
                status: {
                    in: ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED']
                }
            }
        });
        if (activeOrders > 0) {
            throw new common_1.BadRequestException('Cannot delete a coupon that is used in active orders');
        }
        await this.prismaService.coupon.delete({
            where: { id }
        });
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_util_1.PaginationService,
        notification_service_1.NotificationService])
], CouponService);
//# sourceMappingURL=coupon.service.js.map