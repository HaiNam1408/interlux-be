"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductClientModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const product_controller_1 = require("./product.controller");
const product_service_1 = require("./product.service");
let ProductClientModule = class ProductClientModule {
};
exports.ProductClientModule = ProductClientModule;
exports.ProductClientModule = ProductClientModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductClientController],
        providers: [product_service_1.ProductClientService, prisma_service_1.PrismaService, pagination_util_1.PaginationService],
        exports: [product_service_1.ProductClientService],
    })
], ProductClientModule);
//# sourceMappingURL=product.module.js.map