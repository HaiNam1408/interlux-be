"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodStrategy = void 0;
const common_1 = require("@nestjs/common");
let CodStrategy = class CodStrategy {
    async generatePaymentUrl(order) {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        return `${clientUrl}/payment/cod-confirmation?orderId=${order.id}&orderNumber=${order.orderNumber}`;
    }
    async handleCallback(params) {
        return {
            success: true,
            transactionId: `COD-${Date.now()}`,
            message: 'Cash on delivery order confirmed',
            metadata: params
        };
    }
    async verifyPayment(orderId, transactionId, metadata) {
        return true;
    }
};
exports.CodStrategy = CodStrategy;
exports.CodStrategy = CodStrategy = __decorate([
    (0, common_1.Injectable)()
], CodStrategy);
//# sourceMappingURL=cod-strategy.js.map