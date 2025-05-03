import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { VNPayStrategy } from './vnpay-strategy';
import { MomoStrategy } from './momo-strategy';
import { PayPalStrategy } from './paypal-strategy';
import { CodStrategy } from './cod-strategy';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentStrategyFactory {
  constructor(
    private vnpayStrategy: VNPayStrategy,
    private momoStrategy: MomoStrategy,
    private paypalStrategy: PayPalStrategy,
    private codStrategy: CodStrategy,
  ) {}

  getStrategy(paymentMethod: string): PaymentStrategy {
    switch (paymentMethod.toUpperCase()) {
      case PaymentMethod.VNPAY:
        return this.vnpayStrategy;
      case PaymentMethod.MOMO:
        return this.momoStrategy;
      case PaymentMethod.PAYPAL:
        return this.paypalStrategy;
      case PaymentMethod.COD:
        return this.codStrategy;
      default:
        throw new Error(`Payment method ${paymentMethod} not supported`);
    }
  }
}
