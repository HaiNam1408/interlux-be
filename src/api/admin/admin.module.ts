import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from './product/product.module';
import { VariationModule } from './variation/variation.module';
import { CategoryController } from './category/category.controller';
import { ProductController } from './product/product.controller';
import { VariationOptionController } from './variation/variation-option.controller';
import { ProductVariationController } from './variation/product-variation.controller';
import { VariationController } from './variation/variation.controller';
import { CouponController } from './coupon/coupon.controller';
import { CouponModule } from './coupon/coupon.module';

@Module({
    imports: [
        CategoryModule,
        ProductModule,
        VariationModule,
        CouponModule
    ],
    providers: [
        JwtService,
        PrismaService
    ],
    controllers: [
        CategoryController,
        ProductController,
        VariationController,
        VariationOptionController,
        ProductVariationController,
        CouponController
    ],
})
export class AdminModule { }