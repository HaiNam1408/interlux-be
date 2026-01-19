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
exports.ProductAttributeController = void 0;
const common_1 = require("@nestjs/common");
const product_attribute_service_1 = require("./product-attribute.service");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const handleError_global_1 = require("../../../global/handleError.global");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
let ProductAttributeController = class ProductAttributeController {
    constructor(productAttributeService) {
        this.productAttributeService = productAttributeService;
    }
    async create(productId, createProductAttributeDto) {
        try {
            const result = await this.productAttributeService.create(productId, createProductAttributeDto);
            return new api_response_1.default('Product attribute created successfully', common_1.HttpStatus.CREATED, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findAll(productId) {
        try {
            const result = await this.productAttributeService.findAll(productId);
            return new api_response_1.default('Product attributes retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findOne(productId, id) {
        try {
            const result = await this.productAttributeService.findOne(productId, id);
            return new api_response_1.default('Product attribute retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async update(productId, id, updateProductAttributeDto) {
        try {
            const result = await this.productAttributeService.update(productId, id, updateProductAttributeDto);
            return new api_response_1.default('Product attribute updated successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async remove(productId, id) {
        try {
            await this.productAttributeService.remove(productId, id);
            return new api_response_1.default('Product attribute deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async createValue(productId, attributeId, createProductAttributeValueDto) {
        try {
            const result = await this.productAttributeService.createValue(productId, attributeId, createProductAttributeValueDto);
            return new api_response_1.default('Attribute value created successfully', common_1.HttpStatus.CREATED, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async findAllValues(productId, attributeId) {
        try {
            const result = await this.productAttributeService.findAllValues(productId, attributeId);
            return new api_response_1.default('Attribute values retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async updateValue(productId, attributeId, valueId, updateProductAttributeValueDto) {
        try {
            const result = await this.productAttributeService.updateValue(productId, attributeId, valueId, updateProductAttributeValueDto);
            return new api_response_1.default('Attribute value updated successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
    async removeValue(productId, attributeId, valueId) {
        try {
            await this.productAttributeService.removeValue(productId, attributeId, valueId);
            return new api_response_1.default('Attribute value deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            (0, handleError_global_1.resError)(error);
        }
    }
};
exports.ProductAttributeController = ProductAttributeController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create product attribute' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.CreateProductAttributeDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all product attributes' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product attribute by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product attribute' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.UpdateProductAttributeDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete product attribute' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create attribute value' }),
    (0, common_1.Post)(':attributeId/value'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('attributeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, dto_1.CreateProductAttributeValueDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "createValue", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all attribute values' }),
    (0, common_1.Get)(':attributeId/value'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('attributeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "findAllValues", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update attribute value' }),
    (0, common_1.Patch)(':attributeId/value/:valueId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('attributeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('valueId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, dto_1.UpdateProductAttributeValueDto]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "updateValue", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete attribute value' }),
    (0, common_1.Delete)(':attributeId/value/:valueId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('attributeId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('valueId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductAttributeController.prototype, "removeValue", null);
exports.ProductAttributeController = ProductAttributeController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Admin - Product Attribute'),
    (0, common_1.Controller)('product/:productId/attribute'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [product_attribute_service_1.ProductAttributeService])
], ProductAttributeController);
//# sourceMappingURL=product-attribute.controller.js.map