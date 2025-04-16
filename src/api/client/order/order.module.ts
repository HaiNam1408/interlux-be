import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../../../prisma.service';
import { CartModule } from '../cart/cart.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CartModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, JwtService],
  exports: [OrderService],
})
export class OrderModule { }