"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const category_module_1 = require("./category/category.module");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma.service");
const product_module_1 = require("./product/product.module");
const product_attribute_module_1 = require("./product-attribute/product-attribute.module");
const product_variation_module_1 = require("./product-variation/product-variation.module");
const category_controller_1 = require("./category/category.controller");
const product_controller_1 = require("./product/product.controller");
const coupon_controller_1 = require("./coupon/coupon.controller");
const coupon_module_1 = require("./coupon/coupon.module");
const product_attribute_controller_1 = require("./product-attribute/product-attribute.controller");
const product_variation_controller_1 = require("./product-variation/product-variation.controller");
const file_module_1 = require("../../services/file/file.module");
const customer_module_1 = require("./customer/customer.module");
const customer_controller_1 = require("./customer/customer.controller");
const order_module_1 = require("./order/order.module");
const order_controller_1 = require("./order/order.controller");
const auth_module_1 = require("./auth/auth.module");
const auth_controller_1 = require("./auth/auth.controller");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            dashboard_module_1.DashboardModule,
            category_module_1.CategoryModule,
            product_module_1.ProductModule,
            product_attribute_module_1.ProductAttributeModule,
            product_variation_module_1.ProductVariationModule,
            coupon_module_1.CouponModule,
            customer_module_1.CustomerModule,
            order_module_1.OrderModule,
            file_module_1.FilesModule
        ],
        providers: [
            jwt_1.JwtService,
            prisma_service_1.PrismaService
        ],
        controllers: [
            auth_controller_1.AuthController,
            dashboard_controller_1.DashboardController,
            category_controller_1.CategoryController,
            product_controller_1.ProductController,
            product_attribute_controller_1.ProductAttributeController,
            product_variation_controller_1.ProductVariationController,
            coupon_controller_1.CouponController,
            customer_controller_1.CustomerController,
            order_controller_1.OrderController
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map