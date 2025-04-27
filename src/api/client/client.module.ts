import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CategoryClientController } from './category/category.controller';
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
import { ProductClientService } from './product/product.service';
import { ProductClientModule } from './product/product.module';
import { ProductClientController } from './product/product.controller';
import { PaginationService } from 'src/utils/pagination.util';
import { CategoryClientModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { NotificationService, NotificationTemplateService } from 'src/services/notification';

@Module({
    imports: [
        AuthModule,
        CategoryClientModule,
        CartModule,
        OrderModule,
        PaymentModule,
        CouponModule,
        ProductClientModule,
        NotificationModule,
    ],
    providers: [
        JwtService,
        PrismaService,
        ProductClientService,
        PaginationService,
        NotificationService,
        NotificationTemplateService
    ],
    controllers: [
        AuthController,
        CategoryClientController,
        ProductClientController,
        CartController,
        OrderController,
        CouponController,
        PaymentController,
        NotificationController,
    ],
})
export class ClientModule { }
