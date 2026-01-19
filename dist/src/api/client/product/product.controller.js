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
exports.ProductClientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const cache_manager_1 = require("@nestjs/cache-manager");
const product_service_1 = require("./product.service");
const dto_1 = require("./dto");
let ProductClientController = class ProductClientController {
    constructor(productClientService) {
        this.productClientService = productClientService;
    }
    async findAll(findAllProductsClientDto) {
        try {
            const { page, limit, categoryId, search, sortBy, sortDirection, minPrice, maxPrice, attributes, } = findAllProductsClientDto;
            const result = await this.productClientService.findAll({
                page,
                limit,
                categoryId,
                search,
                sortBy,
                sortDirection,
                minPrice,
                maxPrice,
                attributes,
            });
            return new api_response_1.default('Products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getFeaturedProducts() {
        try {
            const result = await this.productClientService.getFeaturedProducts();
            return new api_response_1.default('Featured products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            console.error('Error when fetching featured products:', error);
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getBestSellingProducts() {
        try {
            const result = await this.productClientService.getBestSellingProducts();
            return new api_response_1.default('Best selling products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getNewArrivals() {
        try {
            const result = await this.productClientService.getNewArrivals();
            return new api_response_1.default('New arrival products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getRelatedProducts(id) {
        try {
            const result = await this.productClientService.getRelatedProducts(id);
            return new api_response_1.default('Related products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async findBySlug(id) {
        try {
            const result = await this.productClientService.findBySlug(id);
            return new api_response_1.default('Product details retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getProductsByCategory(slug, findAllProductsClientDto) {
        try {
            const { page, limit, search, sortBy, sortDirection, minPrice, maxPrice, attributes, } = findAllProductsClientDto;
            const result = await this.productClientService.getProductsByCategory(slug, {
                page,
                limit,
                search,
                sortBy,
                sortDirection,
                minPrice,
                maxPrice,
                attributes,
            });
            return new api_response_1.default('Category products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getProductVariations(productId) {
        try {
            const result = await this.productClientService.getProductVariations(productId);
            return new api_response_1.default('Product variations retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getVariationBySku(sku) {
        try {
            const result = await this.productClientService.getVariationBySku(sku);
            return new api_response_1.default('Product variation retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getAvailableFilters(categorySlug) {
        try {
            const result = await this.productClientService.getAvailableFilters(categorySlug);
            return new api_response_1.default('Available filters retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.ProductClientController = ProductClientController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindAllProductsClientDto]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get featured products' }),
    (0, common_1.Get)('featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getFeaturedProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get bestselling products' }),
    (0, common_1.Get)('bestsellers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getBestSellingProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get new arrival products' }),
    (0, common_1.Get)('new-arrivals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getNewArrivals", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get related products' }),
    (0, common_1.Get)('related/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getRelatedProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product details by slug' }),
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category' }),
    (0, common_1.Get)('category/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FindAllProductsClientDto]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getProductsByCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product variations' }),
    (0, common_1.Get)('variations/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getProductVariations", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product variation by SKU' }),
    (0, common_1.Get)('variation/:sku'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getVariationBySku", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get available filters for category' }),
    (0, common_1.Get)('filters/:categorySlug'),
    __param(0, (0, common_1.Param)('categorySlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductClientController.prototype, "getAvailableFilters", null);
exports.ProductClientController = ProductClientController = __decorate([
    (0, swagger_1.ApiTags)('Client - Product'),
    (0, common_1.Controller)('product'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [product_service_1.ProductClientService])
], ProductClientController);
//# sourceMappingURL=product.controller.js.map