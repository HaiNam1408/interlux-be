import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VNPayStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any): Promise<string> {
    // Get configuration from environment variables
    const vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpUrl = this.configService.get<string>('VNPAY_URL');
    const returnUrl = this.configService.get<string>('API_URL') + '/api/client/payment/callback/vnpay';
    
    // Create date for VNPay
    const createDate = new Date().toISOString().split('T')[0].split('-').join('');
    const createTime = new Date().toISOString().split('T')[1].split('.')[0].split(':').join('');
    
    // Format order amount (VNPay requires amount in VND without decimal)
    const amount = Math.floor(order.total * 100).toString();
    
    // Create order info
    const orderInfo = `Payment for order ${order.orderNumber}`;
    const orderType = '190000'; // Payment for product
    const locale = 'vn';
    const currCode = 'VND';
    
    // Create VNPay parameters
    const vnpParams: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: order.orderNumber,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1', // Should be replaced with actual IP
      vnp_CreateDate: createDate + createTime,
    };
    
    // Sort parameters by key
    const sortedParams = this.sortObject(vnpParams);
    
    // Create signature
    const signData = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&');
    
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Add signature to parameters
    sortedParams.vnp_SecureHash = signed;
    
    // Build URL with parameters
    const paymentUrl = vnpUrl + '?' + 
      Object.keys(sortedParams)
        .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
        .join('&');
    
    return paymentUrl;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    // Get VNPay hash secret
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    
    // Extract secure hash from params
    const vnpSecureHash = params.vnp_SecureHash;
    
    // Remove secure hash from params for verification
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;
    
    // Sort parameters
    const sortedParams = this.sortObject(params);
    
    // Create signature
    const signData = Object.keys(sortedParams)
      .map(key => `${key}=${sortedParams[key]}`)
      .join('&');
    
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Verify signature
    if (vnpSecureHash !== signed) {
      return {
        success: false,
        message: 'Invalid signature',
        metadata: params
      };
    }
    
    // Check response code
    const responseCode = params.vnp_ResponseCode;
    if (responseCode === '00') {
      return {
        success: true,
        transactionId: params.vnp_TransactionNo,
        message: 'Payment successful',
        metadata: params
      };
    } else {
      return {
        success: false,
        transactionId: params.vnp_TransactionNo,
        message: `Payment failed with code: ${responseCode}`,
        metadata: params
      };
    }
  }

  async verifyPayment(orderId: number, transactionId: string, metadata: any): Promise<boolean> {
    // In a real implementation, you would verify with VNPay API
    // For now, we'll just check if the transaction ID exists in the metadata
    return metadata && metadata.vnp_TransactionNo === transactionId;
  }

  // Helper method to sort object by key
  private sortObject(obj: any): any {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    
    return sorted;
  }
}
