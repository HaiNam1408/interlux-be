"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const auth_controller_1 = require("./auth/auth.controller");
const category_controller_1 = require("./category/category.controller");
const cart_module_1 = require("./cart/cart.module");
const cart_controller_1 = require("./cart/cart.controller");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma.service");
const order_module_1 = require("./order/order.module");
const order_controller_1 = require("./order/order.controller");
const payment_module_1 = require("./payment/payment.module");
const payment_controller_1 = require("./payment/payment.controller");
const coupon_module_1 = require("./coupon/coupon.module");
const coupon_controller_1 = require("./coupon/coupon.controller");
const product_service_1 = require("./product/product.service");
const product_module_1 = require("./product/product.module");
const product_controller_1 = require("./product/product.controller");
const pagination_util_1 = require("../../utils/pagination.util");
const category_module_1 = require("./category/category.module");
const notification_module_1 = require("./notification/notification.module");
const notification_controller_1 = require("./notification/notification.controller");
const notification_1 = require("../../services/notification");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            category_module_1.CategoryClientModule,
            cart_module_1.CartModule,
            order_module_1.OrderModule,
            payment_module_1.PaymentModule,
            coupon_module_1.CouponModule,
            product_module_1.ProductClientModule,
            notification_module_1.NotificationModule,
        ],
        providers: [
            jwt_1.JwtService,
            prisma_service_1.PrismaService,
            product_service_1.ProductClientService,
            pagination_util_1.PaginationService,
            notification_1.NotificationService,
            notification_1.NotificationTemplateService
        ],
        controllers: [
            auth_controller_1.AuthController,
            category_controller_1.CategoryClientController,
            product_controller_1.ProductClientController,
            cart_controller_1.CartController,
            order_controller_1.OrderController,
            coupon_controller_1.CouponController,
            payment_controller_1.PaymentController,
            notification_controller_1.NotificationController,
        ],
    })
], ClientModule);
//# sourceMappingURL=client.module.js.map