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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const find_all_products_dto_1 = require("./dto/find-all-products.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const update_product_status_dto_1 = require("./dto/update-product-status.dto");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async create(createProductDto, product_images) {
        try {
            if (!product_images || product_images.length === 0) {
                throw new common_1.HttpException('Images are required!', common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.productService.create(createProductDto, product_images);
            return new api_response_1.default('Product created successfully', common_1.HttpStatus.CREATED, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findAll(findAllProductsDto) {
        try {
            const { page, limit, status, categoryId, search, includeInactive } = findAllProductsDto;
            const result = await this.productService.findAll(page, limit, status, categoryId, search, includeInactive);
            return new api_response_1.default('Products retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findOne(id) {
        try {
            const result = await this.productService.findOne(id);
            return new api_response_1.default('Product retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async update(id, updateProductDto, images) {
        try {
            const result = await this.productService.update(id, updateProductDto, images);
            return new api_response_1.default('Product updated successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async updateStatus(id, updateProductStatusDto) {
        try {
            const result = await this.productService.updateStatus(id, updateProductStatusDto.status);
            return new api_response_1.default('Product status updated successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async remove(id) {
        try {
            await this.productService.remove(id);
            return new api_response_1.default('Product deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Create Product",
        type: create_product_dto_1.CreateProductDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 6)),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_products_dto_1.FindAllProductsDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Update Product For Admin",
        type: update_product_dto_1.UpdateProductDto,
        required: false,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("images", 6)),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product status' }),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_status_dto_1.UpdateProductStatusDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete product' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Admin - Product'),
    (0, common_1.Controller)('product'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map