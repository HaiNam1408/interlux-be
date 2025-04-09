import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';

@Module({
    imports: [CategoryModule, ProductModule],
    providers: [JwtService, PrismaService],
    controllers: [CategoryController, ProductController],
})
export class AdminModule { }
