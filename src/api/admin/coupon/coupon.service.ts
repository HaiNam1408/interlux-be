import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import { PaginationService } from 'src/utils/pagination.util';
import { TableName } from 'src/common/enums/table.enum';
import { CommonStatus } from '@prisma/client';

@Injectable()
export class CouponService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pagination: PaginationService
    ) { }

    async findAll(page: number = 1, limit: number = 10, status?: CommonStatus): Promise<any> {
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

        const paginate = await this.pagination.paginate(
            TableName.COUPON,
            { page, limit },
            where,
            select,
            orderBy
        );

        return paginate;
    }

    async findOne(id: number): Promise<any> {
        const coupon = await this.prismaService.coupon.findUnique({
            where: { id }
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }

        return coupon;
    }

    async findByCode(code: string): Promise<any> {
        const coupon = await this.prismaService.coupon.findUnique({
            where: { code }
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with code "${code}" not found`);
        }

        return coupon;
    }

    async create(createCouponDto: CreateCouponDto): Promise<any> {
        // Check if coupon code already exists
        const codeExists = await this.prismaService.coupon.findUnique({
            where: { code: createCouponDto.code }
        });

        if (codeExists) {
            throw new BadRequestException(`Coupon with code "${createCouponDto.code}" already exists`);
        }

        // Validate dates
        if (new Date(createCouponDto.startDate) >= new Date(createCouponDto.endDate)) {
            throw new BadRequestException('End date must be later than start date');
        }

        const coupon = await this.prismaService.coupon.create({
            data: createCouponDto
        });

        return coupon;
    }

    async update(id: number, updateCouponDto: UpdateCouponDto): Promise<any> {
        // Check if coupon exists
        const couponExists = await this.prismaService.coupon.findUnique({
            where: { id }
        });

        if (!couponExists) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }

        // Check if code already exists (if code is being updated)
        if (updateCouponDto.code && updateCouponDto.code !== couponExists.code) {
            const codeExists = await this.prismaService.coupon.findUnique({
                where: { code: updateCouponDto.code }
            });

            if (codeExists) {
                throw new BadRequestException(`Coupon with code "${updateCouponDto.code}" already exists`);
            }
        }

        // Validate dates if both are provided
        if (updateCouponDto.startDate && updateCouponDto.endDate) {
            if (new Date(updateCouponDto.startDate) >= new Date(updateCouponDto.endDate)) {
                throw new BadRequestException('End date must be later than start date');
            }
        } else if (updateCouponDto.startDate && !updateCouponDto.endDate) {
            // If only start date provided, check against existing end date
            if (new Date(updateCouponDto.startDate) >= new Date(couponExists.endDate)) {
                throw new BadRequestException('Start date must be earlier than end date');
            }
        } else if (!updateCouponDto.startDate && updateCouponDto.endDate) {
            // If only end date provided, check against existing start date
            if (new Date(couponExists.startDate) >= new Date(updateCouponDto.endDate)) {
                throw new BadRequestException('End date must be later than start date');
            }
        }

        const updatedCoupon = await this.prismaService.coupon.update({
            where: { id },
            data: updateCouponDto
        });

        return updatedCoupon;
    }

    async remove(id: number): Promise<void> {
        // Check if coupon exists
        const coupon = await this.prismaService.coupon.findUnique({
            where: { id }
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${id} not found`);
        }

        // Check if coupon is used in any active orders
        const activeOrders = await this.prismaService.order.count({
            where: {
                couponId: id,
                status: {
                    in: ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED']
                }
            }
        });

        if (activeOrders > 0) {
            throw new BadRequestException('Cannot delete a coupon that is used in active orders');
        }

        await this.prismaService.coupon.delete({
            where: { id }
        });
    }
}