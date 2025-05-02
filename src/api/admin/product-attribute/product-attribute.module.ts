import { Module } from '@nestjs/common';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';

@Module({
  controllers: [ProductAttributeController],
  providers: [
    ProductAttributeService,
    PrismaService,
    PaginationService
  ],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
