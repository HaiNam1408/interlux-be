import { PaymentStrategy } from './payment-strategy.interface';
export declare class CodStrategy implements PaymentStrategy {
    generatePaymentUrl(order: any): Promise<string>;
    handleCallback(params: any): Promise<{
        success: boolean;
        transactionId?: string;
        message: string;
        metadata?: any;
    }>;
    verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean>;
}
