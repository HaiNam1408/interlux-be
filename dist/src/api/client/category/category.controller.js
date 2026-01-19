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
exports.CategoryClientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const cache_manager_1 = require("@nestjs/cache-manager");
const category_service_1 = require("./category.service");
let CategoryClientController = class CategoryClientController {
    constructor(categoryClientService) {
        this.categoryClientService = categoryClientService;
    }
    async getCategoryMenu() {
        try {
            const result = await this.categoryClientService.getCategoryMenu();
            return new api_response_1.default('Category menu retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getFeaturedCategories() {
        try {
            const result = await this.categoryClientService.getFeaturedCategories();
            return new api_response_1.default('Featured categories retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async findBySlug(slug) {
        try {
            const result = await this.categoryClientService.findBySlug(slug);
            return new api_response_1.default('Category details retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getSubcategories(slug) {
        try {
            const result = await this.categoryClientService.getSubcategories(slug);
            return new api_response_1.default('Subcategories retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getCategoryBreadcrumb(slug) {
        try {
            const result = await this.categoryClientService.getCategoryBreadcrumb(slug);
            return new api_response_1.default('Category breadcrumb retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.CategoryClientController = CategoryClientController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category menu list' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryClientController.prototype, "getCategoryMenu", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get featured categories' }),
    (0, common_1.Get)('featured'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryClientController.prototype, "getFeaturedCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category details by slug' }),
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryClientController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get subcategories by parent slug' }),
    (0, common_1.Get)(':slug/subcategories'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryClientController.prototype, "getSubcategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category breadcrumb by slug' }),
    (0, common_1.Get)(':slug/breadcrumb'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryClientController.prototype, "getCategoryBreadcrumb", null);
exports.CategoryClientController = CategoryClientController = __decorate([
    (0, swagger_1.ApiTags)('Client - Category'),
    (0, common_1.Controller)('category'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [category_service_1.CategoryClientService])
], CategoryClientController);
//# sourceMappingURL=category.controller.js.map