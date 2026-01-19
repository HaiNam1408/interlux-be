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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("./category.service");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const get_all_category_dto_1 = require("./dto/get-all-category.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("../../../services/file/file.service");
const handleError_global_1 = require("../../../global/handleError.global");
let CategoryController = class CategoryController {
    constructor(categoryService, filesService) {
        this.categoryService = categoryService;
        this.filesService = filesService;
    }
    async findAll({ page = 1, limit = 10, parentId }) {
        try {
            const result = await this.categoryService.findAll(page, limit, parentId);
            return new api_response_1.default('Categories retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const category = await this.categoryService.findOne(id);
            return new api_response_1.default('Category retrieved successfully', common_1.HttpStatus.OK, category);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findBySlug(slug) {
        try {
            const category = await this.categoryService.findBySlug(slug);
            return new api_response_1.default('Category retrieved successfully', common_1.HttpStatus.OK, category);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(createCategoryDto, image) {
        try {
            const category = await this.categoryService.create(createCategoryDto, image);
            return new api_response_1.default('Category created successfully', common_1.HttpStatus.CREATED, category);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async update(id, updateCategoryDto, image) {
        try {
            const category = await this.categoryService.update(id, updateCategoryDto, image);
            return new api_response_1.default('Category updated successfully', common_1.HttpStatus.OK, category);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async remove(id) {
        try {
            await this.categoryService.remove(id);
            return new api_response_1.default('Category deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_category_dto_1.GetAllCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', type: String }),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findBySlug", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new category' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Create Category",
        type: dto_1.CreateCategoryDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image")),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update category' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Update Category",
        type: dto_1.UpdateCategoryDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete category' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "remove", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Category'),
    (0, common_1.Controller)('category'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [category_service_1.CategoryService,
        file_service_1.FilesService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map