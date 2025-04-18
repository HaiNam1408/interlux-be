import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryClientController } from './category.controller';
import { CategoryClientService } from './category.service';

@Module({
  controllers: [CategoryClientController],
  providers: [CategoryClientService, PrismaService],
  exports: [CategoryClientService],
})
export class CategoryClientModule { }