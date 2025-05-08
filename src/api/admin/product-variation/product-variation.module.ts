import { Module } from '@nestjs/common';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationService } from './product-variation.service';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/services/file/file.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductVariationController],
  providers: [
    ProductVariationService,
    PrismaService,
    FilesService,
    PaginationService,
    JwtService
  ],
  exports: [ProductVariationService],
})
export class ProductVariationModule {}
