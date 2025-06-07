import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  PaymentStrategyFactory,
  VNPayStrategy,
} from './strategies';
import { NotificationModule } from 'src/services/notification/notification.module';
import { NotificationService } from 'src/services/notification';
import { MailService } from 'src/services/mail/mail.service';

@Module({
  imports: [ConfigModule, NotificationModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    JwtService,
    ConfigService,
    PaymentStrategyFactory,
    VNPayStrategy,
    NotificationService,
    MailService
  ],
  exports: [PaymentService],
})
export class PaymentModule { }