"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariationModule = void 0;
const common_1 = require("@nestjs/common");
const product_variation_controller_1 = require("./product-variation.controller");
const product_variation_service_1 = require("./product-variation.service");
const prisma_service_1 = require("../../../prisma.service");
const file_service_1 = require("../../../services/file/file.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const jwt_1 = require("@nestjs/jwt");
let ProductVariationModule = class ProductVariationModule {
};
exports.ProductVariationModule = ProductVariationModule;
exports.ProductVariationModule = ProductVariationModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_variation_controller_1.ProductVariationController],
        providers: [
            product_variation_service_1.ProductVariationService,
            prisma_service_1.PrismaService,
            file_service_1.FilesService,
            pagination_util_1.PaginationService,
            jwt_1.JwtService
        ],
        exports: [product_variation_service_1.ProductVariationService],
    })
], ProductVariationModule);
//# sourceMappingURL=product-variation.module.js.map