import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import { PaginationService } from 'src/utils/pagination.util';
import { CommonStatus } from '@prisma/client';
import { NotificationService } from 'src/services/notification/notification.service';
export declare class CouponService {
    private readonly prismaService;
    private readonly pagination;
    private readonly notificationService;
    constructor(prismaService: PrismaService, pagination: PaginationService, notificationService: NotificationService);
    findAll(page?: number, limit?: number, status?: CommonStatus): Promise<any>;
    findOne(id: number): Promise<any>;
    findByCode(code: string): Promise<any>;
    create(createCouponDto: CreateCouponDto): Promise<any>;
    update(id: number, updateCouponDto: UpdateCouponDto): Promise<any>;
    remove(id: number): Promise<void>;
}
