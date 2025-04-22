import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { CouponController } from './coupon.controller';

@Module({
  controllers: [CouponController],
  providers: [CouponService, PrismaService, PaginationService, JwtService],
  exports: [CouponService],
})
export class CouponModule { }
