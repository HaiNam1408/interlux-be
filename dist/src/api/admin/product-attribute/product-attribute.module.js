"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAttributeModule = void 0;
const common_1 = require("@nestjs/common");
const product_attribute_controller_1 = require("./product-attribute.controller");
const product_attribute_service_1 = require("./product-attribute.service");
const prisma_service_1 = require("../../../prisma.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const jwt_1 = require("@nestjs/jwt");
let ProductAttributeModule = class ProductAttributeModule {
};
exports.ProductAttributeModule = ProductAttributeModule;
exports.ProductAttributeModule = ProductAttributeModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_attribute_controller_1.ProductAttributeController],
        providers: [
            product_attribute_service_1.ProductAttributeService,
            prisma_service_1.PrismaService,
            pagination_util_1.PaginationService,
            jwt_1.JwtService
        ],
        exports: [product_attribute_service_1.ProductAttributeService],
    })
], ProductAttributeModule);
//# sourceMappingURL=product-attribute.module.js.map