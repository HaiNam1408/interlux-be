import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { VNPayStrategy } from './vnpay-strategy';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentStrategyFactory {
  constructor(
    private vnpayStrategy: VNPayStrategy,
  ) {}

  getStrategy(paymentMethod: string): PaymentStrategy {
    switch (paymentMethod.toUpperCase()) {
      case PaymentMethod.VNPAY:
        return this.vnpayStrategy;
      default:
        throw new Error(`Payment method ${paymentMethod} not supported`);
    }
  }
}
