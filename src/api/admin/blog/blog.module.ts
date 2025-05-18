import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { FilesService } from 'src/services/file/file.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  providers: [BlogService, PrismaService, PaginationService, FilesService, JwtService],
  exports: [BlogService],
})
export class BlogModule { }
