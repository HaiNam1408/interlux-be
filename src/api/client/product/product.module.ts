import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductClientController } from './product.controller';
import { ProductClientService } from './product.service';

@Module({
  controllers: [ProductClientController],
  providers: [ProductClientService, PrismaService, PaginationService],
  exports: [ProductClientService],
})
export class ProductClientModule { }