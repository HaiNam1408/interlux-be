import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/services/file/file.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    FilesService,
    PaginationService,
    JwtService
  ],
  exports: [ProductService],
})
export class ProductModule {}
