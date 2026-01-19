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
exports.PaymentStrategyFactory = void 0;
const common_1 = require("@nestjs/common");
const vnpay_strategy_1 = require("./vnpay-strategy");
const momo_strategy_1 = require("./momo-strategy");
const paypal_strategy_1 = require("./paypal-strategy");
const cod_strategy_1 = require("./cod-strategy");
const client_1 = require("@prisma/client");
let PaymentStrategyFactory = class PaymentStrategyFactory {
    constructor(vnpayStrategy, momoStrategy, paypalStrategy, codStrategy) {
        this.vnpayStrategy = vnpayStrategy;
        this.momoStrategy = momoStrategy;
        this.paypalStrategy = paypalStrategy;
        this.codStrategy = codStrategy;
    }
    getStrategy(paymentMethod) {
        switch (paymentMethod.toUpperCase()) {
            case client_1.PaymentMethod.VNPAY:
                return this.vnpayStrategy;
            case client_1.PaymentMethod.MOMO:
                return this.momoStrategy;
            case client_1.PaymentMethod.PAYPAL:
                return this.paypalStrategy;
            case client_1.PaymentMethod.COD:
                return this.codStrategy;
            default:
                throw new Error(`Payment method ${paymentMethod} not supported`);
        }
    }
};
exports.PaymentStrategyFactory = PaymentStrategyFactory;
exports.PaymentStrategyFactory = PaymentStrategyFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vnpay_strategy_1.VNPayStrategy,
        momo_strategy_1.MomoStrategy,
        paypal_strategy_1.PayPalStrategy,
        cod_strategy_1.CodStrategy])
], PaymentStrategyFactory);
//# sourceMappingURL=payment-strategy-factory.js.map