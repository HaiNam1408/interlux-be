import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from './product/product.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';
import { ProductVariationModule } from './product-variation/product-variation.module';
import { CategoryController } from './category/category.controller';
import { ProductController } from './product/product.controller';
import { CouponController } from './coupon/coupon.controller';
import { CouponModule } from './coupon/coupon.module';
import { ProductAttributeController } from './product-attribute/product-attribute.controller';
import { ProductVariationController } from './product-variation/product-variation.controller';
import { FilesModule } from 'src/services/file/file.module';
import { CustomerModule } from './customer/customer.module';
import { CustomerController } from './customer/customer.controller';
import { OrderModule } from './order/order.module';
import { OrderController } from './order/order.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { BlogModule } from './blog/blog.module';
import { BlogController } from './blog/blog.controller';
import { TagModule } from './tag/tag.module';
import { TagController } from './tag/tag.controller';

@Module({
    imports: [
        AuthModule,
        DashboardModule,
        CategoryModule,
        ProductModule,
        ProductAttributeModule,
        ProductVariationModule,
        CouponModule,
        CustomerModule,
        OrderModule,
        FilesModule,
        BlogModule,
        TagModule
    ],
    providers: [
        JwtService,
        PrismaService
    ],
    controllers: [
        AuthController,
        DashboardController,
        CategoryController,
        ProductController,
        ProductAttributeController,
        ProductVariationController,
        CouponController,
        CustomerController,
        OrderController,
        BlogController,
        TagController
    ],
})
export class AdminModule { }