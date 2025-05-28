import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MomoStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any): Promise<string> {
    const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const momoEndpoint = this.configService.get<string>('MOMO_ENDPOINT');
    const returnUrl = this.configService.get<string>('API_URL') + '/api/client/payment/callback/momo';
    const notifyUrl = this.configService.get<string>('API_URL') + '/api/client/payment/notify/momo';
    
    const requestId = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const orderId = order.orderNumber;
    
    const amount = order.total.toString();
    
    const orderInfo = `Payment for order ${order.orderNumber}`;
    
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
    
    const rawSignature = Object.keys(requestData)
      .map(key => `${key}=${requestData[key]}`)
      .join('&');
    
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    
    const requestBody = {
      ...requestData,
      signature: signature
    };
    
    const paymentUrl = `${momoEndpoint}?` + 
      Object.keys(requestBody)
        .map(key => `${key}=${encodeURIComponent(requestBody[key])}`)
        .join('&');
    
    return paymentUrl;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const signature = params.signature;
    
    const verifyParams = { ...params };
    delete verifyParams.signature;
    
    const rawSignature = Object.keys(verifyParams)
      .map(key => `${key}=${verifyParams[key]}`)
      .join('&');
    
    const verifySignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    
    if (signature !== verifySignature) {
      return {
        success: false,
        message: 'Invalid signature',
        metadata: params
      };
    }
    
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
    return metadata && metadata.transId === transactionId;
  }
}
