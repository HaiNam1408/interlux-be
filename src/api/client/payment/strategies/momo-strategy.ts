import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MomoStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any): Promise<string> {
    // Get configuration from environment variables
    const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const momoEndpoint = this.configService.get<string>('MOMO_ENDPOINT');
    const returnUrl = this.configService.get<string>('API_URL') + '/api/client/payment/callback/momo';
    const notifyUrl = this.configService.get<string>('API_URL') + '/api/client/payment/notify/momo';
    
    // Create request ID and order ID
    const requestId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const orderId = order.orderNumber;
    
    // Format amount (Momo requires amount as string)
    const amount = order.total.toString();
    
    // Create order info
    const orderInfo = `Payment for order ${order.orderNumber}`;
    
    // Create request data
    const requestData = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      returnUrl: returnUrl,
      notifyUrl: notifyUrl,
      extraData: Buffer.from(JSON.stringify({
        orderId: order.id,
        userId: order.userId
      })).toString('base64')
    };
    
    // Create signature
    const rawSignature = Object.keys(requestData)
      .map(key => `${key}=${requestData[key]}`)
      .join('&');
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    
    // Add signature to request data
    const requestBody = {
      ...requestData,
      signature: signature
    };
    
    // In a real implementation, you would make an HTTP request to Momo API
    // For this mock implementation, we'll just return a URL with the parameters
    const paymentUrl = `${momoEndpoint}?` + 
      Object.keys(requestBody)
        .map(key => `${key}=${encodeURIComponent(requestBody[key])}`)
        .join('&');
    
    return paymentUrl;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    // Get Momo secret key
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    
    // Extract signature from params
    const signature = params.signature;
    
    // Create a copy of params without signature for verification
    const verifyParams = { ...params };
    delete verifyParams.signature;
    
    // Create raw signature
    const rawSignature = Object.keys(verifyParams)
      .map(key => `${key}=${verifyParams[key]}`)
      .join('&');
    
    // Create verification signature
    const verifySignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    
    // Verify signature
    if (signature !== verifySignature) {
      return {
        success: false,
        message: 'Invalid signature',
        metadata: params
      };
    }
    
    // Check response code
    if (params.resultCode === '0') {
      return {
        success: true,
        transactionId: params.transId,
        message: 'Payment successful',
        metadata: params
      };
    } else {
      return {
        success: false,
        transactionId: params.transId,
        message: `Payment failed with code: ${params.resultCode}`,
        metadata: params
      };
    }
  }

  async verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean> {
    // In a real implementation, you would verify with Momo API
    // For now, we'll just check if the transaction ID exists in the metadata
    return metadata && metadata.transId === transactionId;
  }
}
