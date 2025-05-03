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

@Module({
    imports: [
        CategoryModule,
        ProductModule,
        ProductAttributeModule,
        ProductVariationModule,
        CouponModule,
        FilesModule
    ],
    providers: [
        JwtService,
        PrismaService
    ],
    controllers: [
        CategoryController,
        ProductController,
        ProductAttributeController,
        ProductVariationController,
        CouponController
    ],
})
export class AdminModule { }