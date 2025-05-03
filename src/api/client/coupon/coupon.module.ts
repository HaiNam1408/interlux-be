import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { PrismaService } from '../../../prisma.service';
import { CartModule } from '../cart/cart.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CartModule],
  controllers: [CouponController],
  providers: [CouponService, PrismaService, JwtService],
  exports: [CouponService],
})
export class CouponModule { }