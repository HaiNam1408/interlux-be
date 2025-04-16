import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, JwtService],
  exports: [PaymentService],
})
export class PaymentModule { }