import { Module } from '@nestjs/common';
import { BlogClientController } from './blog.controller';
import { BlogClientService } from './blog.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';

@Module({
  controllers: [BlogClientController],
  providers: [BlogClientService, PrismaService, PaginationService],
  exports: [BlogClientService],
})
export class BlogClientModule { }
