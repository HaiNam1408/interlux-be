"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNPayStrategy = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const config_1 = require("@nestjs/config");
let VNPayStrategy = class VNPayStrategy {
    constructor(configService) {
        this.configService = configService;
    }
    async generatePaymentUrl(order) {
        const vnpTmnCode = this.configService.get('VNPAY_TMN_CODE');
        const vnpHashSecret = this.configService.get('VNPAY_HASH_SECRET');
        const vnpUrl = this.configService.get('VNPAY_URL');
        const returnUrl = this.configService.get('API_URL') + '/api/client/payment/callback/vnpay';
        const createDate = new Date().toISOString().split('T')[0].split('-').join('');
        const createTime = new Date().toISOString().split('T')[1].split('.')[0].split(':').join('');
        const amount = Math.floor(order.total * 100).toString();
        const orderInfo = `Payment for order ${order.orderNumber}`;
        const orderType = '190000';
        const locale = 'vn';
        const currCode = 'VND';
        const vnpParams = {
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
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: createDate + createTime,
        };
        const sortedParams = this.sortObject(vnpParams);
        const signData = Object.keys(sortedParams)
            .map(key => `${key}=${sortedParams[key]}`)
            .join('&');
        const hmac = crypto.createHmac('sha512', vnpHashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        sortedParams.vnp_SecureHash = signed;
        const paymentUrl = vnpUrl + '?' +
            Object.keys(sortedParams)
                .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
                .join('&');
        return paymentUrl;
    }
    async handleCallback(params) {
        const vnpHashSecret = this.configService.get('VNPAY_HASH_SECRET');
        const vnpSecureHash = params.vnp_SecureHash;
        delete params.vnp_SecureHash;
        delete params.vnp_SecureHashType;
        const sortedParams = this.sortObject(params);
        const signData = Object.keys(sortedParams)
            .map(key => `${key}=${sortedParams[key]}`)
            .join('&');
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
        }
        else {
            return {
                success: false,
                transactionId: params.vnp_TransactionNo,
                message: `Payment failed with code: ${responseCode}`,
                metadata: params
            };
        }
    }
    async verifyPayment(orderId, transactionId, metadata) {
        return metadata && metadata.vnp_TransactionNo === transactionId;
    }
    sortObject(obj) {
        const sorted = {};
        const keys = Object.keys(obj).sort();
        for (const key of keys) {
            sorted[key] = obj[key];
        }
        return sorted;
    }
};
exports.VNPayStrategy = VNPayStrategy;
exports.VNPayStrategy = VNPayStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VNPayStrategy);
//# sourceMappingURL=vnpay-strategy.js.map