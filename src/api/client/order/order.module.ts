import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../../../prisma.service';
import { CartModule } from '../cart/cart.module';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/services/notification/notification.module';
import { NotificationService } from 'src/services/notification';

@Module({
  imports: [CartModule, NotificationModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, JwtService, NotificationService],
  exports: [OrderService],
})
export class OrderModule { }