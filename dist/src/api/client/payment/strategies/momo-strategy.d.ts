import { PaymentStrategy } from './payment-strategy.interface';
import { ConfigService } from '@nestjs/config';
export declare class MomoStrategy implements PaymentStrategy {
    private configService;
    constructor(configService: ConfigService);
    generatePaymentUrl(order: any): Promise<string>;
    handleCallback(params: any): Promise<{
        success: boolean;
        transactionId?: string;
        message: string;
        metadata?: any;
    }>;
    verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean>;
}
