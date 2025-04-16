import { Module } from '@nestjs/common';
import { VariationController } from './variation.controller';
import { VariationService } from './variation.service';
import { VariationOptionController } from './variation-option.controller';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationService } from './product-variation.service';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/services/file/file.service';
import { PaginationService } from 'src/utils/pagination.util';

@Module({
  controllers: [
    VariationController,
    VariationOptionController,
    ProductVariationController,
  ],
  providers: [
    VariationService,
    ProductVariationService,
    PrismaService,
    FilesService,
    PaginationService,
  ],
  exports: [
    VariationService,
    ProductVariationService,
  ],
})
export class VariationModule { }