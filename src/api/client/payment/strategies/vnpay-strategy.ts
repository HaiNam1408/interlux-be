import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import * as moment from 'moment';


@Injectable()
export class VNPayStrategy implements PaymentStrategy {
  constructor(private configService: ConfigService) {}

  async generatePaymentUrl(order: any, ipAddress: string): Promise<string> {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpUrl = this.configService.get<string>('VNPAY_URL');
    const returnUrl = this.configService.get<string>('API_URL') + '/api/v1/client/payment/callback/vnpay';
    const exchangeRate = 26020;
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    const vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: order.orderNumber,
      vnp_OrderInfo: `Payment for order ${order.orderNumber}`,
      vnp_OrderType: 'other',
      vnp_Amount: order.total * exchangeRate * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddress ?? '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedParams = this.sortObject(vnpParams);
    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;

    const paymentUrl = vnpUrl + '?' + qs.stringify(sortedParams, { encode: false });
    return paymentUrl;
  }

  async handleCallback(params: any): Promise<{ success: boolean; transactionId?: string; message: string; metadata?: any; }> {
    const vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpSecureHash = params.vnp_SecureHash;

    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;
    
    const sortedParams = this.sortObject(params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    if (vnpSecureHash !== signed) {
      return {
        success: false,
        message: 'Invalid signature',
        metadata: params
      };
    }
    
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
    return metadata && metadata.vnp_TransactionNo === transactionId;
  }

  private sortObject(obj: Record<string, any>) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
