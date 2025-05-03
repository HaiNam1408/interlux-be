import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { CouponController } from './coupon.controller';
import { NotificationService, NotificationTemplateService } from 'src/services/notification';

@Module({
  controllers: [CouponController],
  providers: [CouponService, PrismaService, PaginationService, JwtService, NotificationService, NotificationTemplateService],
  exports: [CouponService],
})
export class CouponModule { }
