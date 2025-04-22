import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  PaymentStrategyFactory,
  VNPayStrategy,
  MomoStrategy,
  PayPalStrategy,
  CodStrategy
} from './strategies';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    JwtService,
    ConfigService,
    PaymentStrategyFactory,
    VNPayStrategy,
    MomoStrategy,
    PayPalStrategy,
    CodStrategy
  ],
  exports: [PaymentService],
})
export class PaymentModule { }