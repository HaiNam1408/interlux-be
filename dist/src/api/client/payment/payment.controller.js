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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const dto_1 = require("./dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const api_response_1 = require("../../../global/api.response");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async getPaymentDetail(req, id) {
        const payment = await this.paymentService.getPaymentDetail(req.user.userId, +id);
        return api_response_1.default.success({ payment });
    }
    async verifyPayment(req, verifyPaymentDto) {
        const payment = await this.paymentService.verifyPayment(req.user.userId, verifyPaymentDto);
        return api_response_1.default.success({
            payment,
            message: 'Thanh toán đã được xác nhận thành công',
        });
    }
    async createPaymentUrl(req, createPaymentUrlDto) {
        const { orderId, paymentMethod } = createPaymentUrlDto;
        const paymentData = await this.paymentService.createPaymentUrl(req.user.userId, orderId, paymentMethod);
        return api_response_1.default.success({
            ...paymentData,
            message: 'Payment URL created successfully',
        });
    }
    async paymentCallback(paymentMethod, query, body) {
        const params = { ...query, ...body };
        const result = await this.paymentService.handlePaymentCallback(paymentMethod, params);
        return api_response_1.default.success({
            ...result,
        });
    }
    async paymentNotification(paymentMethod, query, body) {
        const params = { ...query, ...body };
        const result = await this.paymentService.handlePaymentCallback(paymentMethod, params);
        return api_response_1.default.success({
            ...result,
        });
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment details' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentDetail", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify payment' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('create-url'),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment URL' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreatePaymentUrlDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentUrl", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.All)('callback/:paymentMethod'),
    (0, swagger_1.ApiOperation)({ summary: 'Payment gateway callback' }),
    __param(0, (0, common_1.Param)('paymentMethod')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.All)('notify/:paymentMethod'),
    (0, swagger_1.ApiOperation)({ summary: 'Payment gateway notification webhook' }),
    __param(0, (0, common_1.Param)('paymentMethod')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "paymentNotification", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Client - Payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map