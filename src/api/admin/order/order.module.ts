import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { NotificationModule } from 'src/services/notification/notification.module';
import { NotificationService, NotificationTemplateService } from 'src/services/notification';

@Module({
  imports: [NotificationModule],
  controllers: [OrderController],
  providers: [
    OrderService, 
    PrismaService, 
    PaginationService, 
    JwtService, 
    NotificationService,
    NotificationTemplateService
  ],
  exports: [OrderService],
})
export class OrderModule { }
