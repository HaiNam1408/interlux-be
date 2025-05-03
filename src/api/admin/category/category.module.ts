import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { FilesModule } from 'src/services/file/file.module';

@Module({
  imports: [FilesModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, PaginationService, JwtService],
  exports: [CategoryService],
})
export class CategoryModule {}
