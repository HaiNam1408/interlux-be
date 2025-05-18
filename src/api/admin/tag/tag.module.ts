import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaService, PaginationService, JwtService],
  exports: [TagService],
})
export class TagModule { }
