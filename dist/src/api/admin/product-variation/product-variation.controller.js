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
exports.ProductVariationController = void 0;
const common_1 = require("@nestjs/common");
const product_variation_service_1 = require("./product-variation.service");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const platform_express_1 = require("@nestjs/platform-express");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
let ProductVariationController = class ProductVariationController {
    constructor(productVariationService) {
        this.productVariationService = productVariationService;
    }
    async create(productId, createProductVariationDto, images) {
        try {
            const result = await this.productVariationService.create(productId, createProductVariationDto, images || []);
            return new api_response_1.default('Product variation created successfully', common_1.HttpStatus.CREATED, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findAll(productId) {
        try {
            const result = await this.productVariationService.findAll(productId);
            return new api_response_1.default('Product variations retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findOne(productId, id) {
        try {
            const result = await this.productVariationService.findOne(productId, id);
            return new api_response_1.default('Product variation retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async update(productId, id, updateProductVariationDto, images) {
        try {
            const result = await this.productVariationService.update(productId, id, updateProductVariationDto, images || []);
            return new api_response_1.default('Product variation updated successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async remove(productId, id) {
        try {
            await this.productVariationService.remove(productId, id);
            return new api_response_1.default('Product variation deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
};
exports.ProductVariationController = ProductVariationController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create product variation' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Create Product Variation",
        type: dto_1.CreateProductVariationDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 6)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateProductVariationDto, Array]),
    __metadata("design:returntype", Promise)
], ProductVariationController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all product variations' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductVariationController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product variation by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductVariationController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product variation' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Update Product Variation",
        type: dto_1.UpdateProductVariationDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 6)),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateProductVariationDto, Array]),
    __metadata("design:returntype", Promise)
], ProductVariationController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete product variation' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductVariationController.prototype, "remove", null);
exports.ProductVariationController = ProductVariationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Admin - Product Variation'),
    (0, common_1.Controller)('product/:productId/variation'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [product_variation_service_1.ProductVariationService])
], ProductVariationController);
//# sourceMappingURL=product-variation.controller.js.map