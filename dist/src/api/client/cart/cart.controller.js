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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const dto_1 = require("./dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const api_response_1 = require("../../../global/api.response");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(req) {
        const cart = await this.cartService.getOrCreateCart(req.user.userId);
        const summary = await this.cartService.getCartSummary(cart);
        return api_response_1.default.success({
            cart,
            summary
        });
    }
    async addToCart(req, addToCartDto) {
        const cart = await this.cartService.addToCart(req.user.userId, addToCartDto);
        const summary = await this.cartService.getCartSummary(cart);
        return api_response_1.default.success({
            cart,
            summary,
            message: 'Product added to cart successfully'
        });
    }
    async updateCartItem(req, updateCartItemDto) {
        const cart = await this.cartService.updateCartItem(req.user.userId, updateCartItemDto);
        const summary = await this.cartService.getCartSummary(cart);
        return api_response_1.default.success({
            cart,
            summary,
            message: 'Cart updated successfully'
        });
    }
    async removeCartItem(req, cartItemId) {
        const cart = await this.cartService.removeCartItem(req.user.userId, +cartItemId);
        const summary = await this.cartService.getCartSummary(cart);
        return api_response_1.default.success({
            cart,
            summary,
            message: 'Product removed from cart successfully'
        });
    }
    async clearCart(req) {
        const cart = await this.cartService.clearCart(req.user.userId);
        const summary = await this.cartService.getCartSummary(cart);
        return api_response_1.default.success({
            cart,
            summary,
            message: 'Cart cleared successfully'
        });
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user\'s cart information' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to cart' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddToCartDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)('item'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product quantity in cart' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('item/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from cart' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeCartItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear entire cart' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Client - Cart'),
    (0, common_1.Controller)('cart'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map