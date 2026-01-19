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
exports.MomoStrategy = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const config_1 = require("@nestjs/config");
let MomoStrategy = class MomoStrategy {
    constructor(configService) {
        this.configService = configService;
    }
    async generatePaymentUrl(order) {
        const partnerCode = this.configService.get('MOMO_PARTNER_CODE');
        const accessKey = this.configService.get('MOMO_ACCESS_KEY');
        const secretKey = this.configService.get('MOMO_SECRET_KEY');
        const momoEndpoint = this.configService.get('MOMO_ENDPOINT');
        const returnUrl = this.configService.get('API_URL') + '/api/client/payment/callback/momo';
        const notifyUrl = this.configService.get('API_URL') + '/api/client/payment/notify/momo';
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
    async handleCallback(params) {
        const secretKey = this.configService.get('MOMO_SECRET_KEY');
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
        }
        else {
            return {
                success: false,
                transactionId: params.transId,
                message: `Payment failed with code: ${params.resultCode}`,
                metadata: params
            };
        }
    }
    async verifyPayment(orderId, transactionId, metadata) {
        return metadata && metadata.transId === transactionId;
    }
};
exports.MomoStrategy = MomoStrategy;
exports.MomoStrategy = MomoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MomoStrategy);
//# sourceMappingURL=momo-strategy.js.map