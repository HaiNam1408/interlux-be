// api/client/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, JwtService],
  exports: [CartService],
})
export class CartModule { }