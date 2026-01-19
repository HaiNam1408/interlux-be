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
exports.PayPalStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PayPalStrategy = class PayPalStrategy {
    constructor(configService) {
        this.configService = configService;
    }
    async generatePaymentUrl(order) {
        const clientId = this.configService.get('PAYPAL_CLIENT_ID');
        const clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
        const paypalUrl = this.configService.get('PAYPAL_URL') || 'https://www.sandbox.paypal.com';
        const apiUrl = this.configService.get('API_URL');
        const clientUrl = this.configService.get('CLIENT_URL');
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
    async handleCallback(params) {
        if (params.token && params.PayerID) {
            let customData = {};
            try {
                if (params.custom) {
                    customData = JSON.parse(params.custom);
                }
            }
            catch (error) {
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
        }
        else {
            return {
                success: false,
                message: 'Payment failed or cancelled',
                metadata: params
            };
        }
    }
    async verifyPayment(orderId, transactionId, metadata) {
        return metadata && metadata.PayerID === transactionId;
    }
};
exports.PayPalStrategy = PayPalStrategy;
exports.PayPalStrategy = PayPalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PayPalStrategy);
//# sourceMappingURL=paypal-strategy.js.map