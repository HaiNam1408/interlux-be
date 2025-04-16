import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AuthController } from './auth/auth.controller';
import { CategoryController } from './category/category.controller';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { OrderModule } from './order/order.module';
import { OrderController } from './order/order.controller';
import { PaymentModule } from './payment/payment.module';
import { PaymentController } from './payment/payment.controller';
import { CouponModule } from './coupon/coupon.module';
import { CouponController } from './coupon/coupon.controller';

@Module({
    imports: [
        AuthModule,
        CategoryModule,
        CartModule,
        OrderModule,
        PaymentModule,
        CouponModule,
    ],
    providers: [
        JwtService,
        PrismaService
    ],
    controllers: [
        AuthController, 
        CategoryController,
        CartController,
        OrderController,
        CouponController,
        PaymentController,
    ],
})
export class ClientModule { }
 