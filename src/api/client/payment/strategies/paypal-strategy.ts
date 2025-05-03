import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayPalStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any): Promise<string> {
    // Get configuration from environment variables
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const paypalUrl = this.configService.get<string>('PAYPAL_URL') || 'https://www.sandbox.paypal.com';
    const apiUrl = this.configService.get<string>('API_URL');
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    
    // In a real implementation, you would use PayPal SDK to create a payment
    // For this mock implementation, we'll just return a URL with the parameters
    
    // Format amount (PayPal requires amount with 2 decimal places)
    const amount = parseFloat(order.total).toFixed(2);
    
    // Create return URLs
    const returnUrl = `${apiUrl}/api/client/payment/callback/paypal`;
    const cancelUrl = `${clientUrl}/payment/cancel`;
    
    // Create mock PayPal URL
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
    // In a real implementation, you would verify the payment with PayPal API
    // For this mock implementation, we'll just check the parameters
    
    if (params.token && params.PayerID) {
      // Extract custom data
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
    // In a real implementation, you would verify with PayPal API
    // For now, we'll just check if the transaction ID exists in the metadata
    return metadata && metadata.PayerID === transactionId;
  }
}
