import { PaymentStrategy } from './payment-strategy.interface';
import { VNPayStrategy } from './vnpay-strategy';
import { MomoStrategy } from './momo-strategy';
import { PayPalStrategy } from './paypal-strategy';
import { CodStrategy } from './cod-strategy';
export declare class PaymentStrategyFactory {
    private vnpayStrategy;
    private momoStrategy;
    private paypalStrategy;
    private codStrategy;
    constructor(vnpayStrategy: VNPayStrategy, momoStrategy: MomoStrategy, paypalStrategy: PayPalStrategy, codStrategy: CodStrategy);
    getStrategy(paymentMethod: string): PaymentStrategy;
}
