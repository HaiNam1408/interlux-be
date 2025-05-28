import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayPalStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any): Promise<string> {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const paypalUrl = this.configService.get<string>('PAYPAL_URL') || 'https://www.sandbox.paypal.com';
    const apiUrl = this.configService.get<string>('API_URL');
    const clientUrl = this.configService.get<string>('CLIENT_URL');

    const amount = parseFloat(order.total).toFixed(2);
    
    const returnUrl = `${apiUrl}/api/client/payment/callback/paypal`;
    const cancelUrl = `${clientUrl}/payment/cancel`;
    
    const paymentUrl = `${paypalUrl}/checkout?` + 
      `cmd=_express-checkout` +
      `&token=EC-${Date.now()}${Math.floor(Math.random() * 1000000)}` +
      `&amount=${encodeURIComponent(amount)}` +
      `&currency_code=USD` +
      `&item_name=${encodeURIComponent(`Order ${order.orderNumber}`)}` +
      `&invoice=${encodeURIComponent(order.orderNumber)}` +
      `&return=${encodeURIComponent(returnUrl)}` +
      `&cancel_return=${encodeURIComponent(cancelUrl)}` +
      `&custom=${encodeURIComponent(JSON.stringify({
        orderId: order.id,
        userId: order.userId
      }))}`;
    
    return paymentUrl;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    if (params.token && params.PayerID) {
      let customData = {};
      try {
        if (params.custom) {
          customData = JSON.parse(params.custom);
        }
      } catch (error) {
        console.error('Error parsing custom data:', error);
      }
      
      return {
        success: true,
        transactionId: params.PayerID,
        message: 'Payment successful',
        metadata: {
          ...params,
          ...customData
        }
      };
    } else {
      return {
        success: false,
        message: 'Payment failed or cancelled',
        metadata: params
      };
    }
  }

  async verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean> {
    return metadata && metadata.PayerID === transactionId;
  }
}
