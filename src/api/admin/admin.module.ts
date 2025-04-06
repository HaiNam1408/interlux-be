import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [CategoryModule],
    providers: [JwtService, PrismaService],
    controllers: [CategoryController],
})
export class AdminModule { }
