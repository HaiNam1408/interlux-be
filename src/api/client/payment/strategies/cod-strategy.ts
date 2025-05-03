import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';

@Injectable()
export class CodStrategy implements PaymentStrategy {
  async generatePaymentUrl(order: any): Promise<string> {
    // For COD, we don't need a payment URL
    // Instead, we'll return a special URL that will be handled by the frontend
    // to show a confirmation page
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return `${clientUrl}/payment/cod-confirmation?orderId=${order.id}&orderNumber=${order.orderNumber}`;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    // For COD, the callback is just a confirmation
    // In a real implementation, this might update the order status
    
    return {
      success: true,
      transactionId: `COD-${Date.now()}`,
      message: 'Cash on delivery order confirmed',
      metadata: params
    };
  }

  async verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean> {
    // For COD, verification is always true as payment happens on delivery
    return true;
  }
}