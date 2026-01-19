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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const createSlug_util_1 = require("../../../utils/createSlug.util");
const pagination_util_1 = require("../../../utils/pagination.util");
const table_enum_1 = require("../../../common/enums/table.enum");
const file_service_1 = require("../../../services/file/file.service");
let CategoryService = class CategoryService {
    constructor(prismaService, pagination, filesService) {
        this.prismaService = prismaService;
        this.pagination = pagination;
        this.filesService = filesService;
    }
    async findAll(page = 1, limit = 10, parentId) {
        const where = parentId !== undefined ? { parentId } : { parentId: null };
        const select = {
            id: true,
            name: true,
            slug: true,
            sort: true,
            parentId: true,
            image: true,
            children: {
                select: { id: true, name: true, slug: true, image: true },
                orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }]
            }
        };
        const orderBy = [{ sort: 'asc' }, { createdAt: 'desc' }];
        const paginate = await this.pagination.paginate(table_enum_1.TableName.CATEGORY, { page, limit }, where, select, orderBy);
        return paginate;
    }
    async findOne(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" not found`);
        }
        return category;
    }
    async create(createCategoryDto, image) {
        if (createCategoryDto.parentId) {
            const parentExists = await this.prismaService.category.findUnique({
                where: { id: createCategoryDto.parentId }
            });
            if (!parentExists) {
                throw new common_1.BadRequestException(`Parent category with ID ${createCategoryDto.parentId} not found`);
            }
        }
        const nameExists = await this.prismaService.category.findUnique({
            where: { name: createCategoryDto.name }
        });
        if (nameExists) {
            throw new common_1.BadRequestException(`Category with name "${createCategoryDto.name}" already exists`);
        }
        const slug = createSlug_util_1.SlugUtil.createSlug(createCategoryDto.name);
        const slugExists = await this.prismaService.category.findUnique({
            where: { slug }
        });
        if (slugExists) {
            throw new common_1.BadRequestException(`Category with slug "${slug}" already exists`);
        }
        let imageData = null;
        if (image) {
            imageData = await this.filesService.uploadFile(image.buffer, image.originalname, 'categories', 'image');
        }
        else if (createCategoryDto.image) {
            imageData = createCategoryDto.image;
        }
        const category = await this.prismaService.category.create({
            data: {
                ...createCategoryDto,
                slug,
                image: imageData
            },
            include: {
                parent: true
            }
        });
        return category;
    }
    async update(id, updateCategoryDto, image) {
        const categoryExists = await this.prismaService.category.findUnique({
            where: { id }
        });
        if (!categoryExists) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (updateCategoryDto.parentId && updateCategoryDto.parentId === id) {
            throw new common_1.BadRequestException('A category cannot be its own parent');
        }
        if (updateCategoryDto.parentId) {
            const parentExists = await this.prismaService.category.findUnique({
                where: { id: updateCategoryDto.parentId }
            });
            if (!parentExists) {
                throw new common_1.BadRequestException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
            }
            const isChild = await this.isChildOf(updateCategoryDto.parentId, id);
            if (isChild) {
                throw new common_1.BadRequestException('Cannot set a child category as parent (circular reference)');
            }
        }
        if (updateCategoryDto.name && updateCategoryDto.name !== categoryExists.name) {
            const nameExists = await this.prismaService.category.findUnique({
                where: { name: updateCategoryDto.name }
            });
            if (nameExists) {
                throw new common_1.BadRequestException(`Category with name "${updateCategoryDto.name}" already exists`);
            }
        }
        const newSlug = createSlug_util_1.SlugUtil.createSlug(updateCategoryDto.name || categoryExists.name);
        if (newSlug && newSlug !== categoryExists.slug) {
            const slugExists = await this.prismaService.category.findUnique({
                where: { slug: newSlug }
            });
            if (slugExists) {
                throw new common_1.BadRequestException(`Category with slug "${newSlug}" already exists`);
            }
        }
        let imageData = undefined;
        console.log(updateCategoryDto.image);
        if (image) {
            if (categoryExists.image) {
                const oldImage = typeof categoryExists.image === 'string'
                    ? JSON.parse(categoryExists.image)
                    : categoryExists.image;
                if (oldImage && oldImage.fileName) {
                    await this.filesService.deletePublicFile(oldImage.fileName);
                }
            }
            imageData = await this.filesService.uploadFile(image.buffer, image.originalname, 'categories', 'image');
        }
        else if (updateCategoryDto.image === "" && categoryExists.image) {
            const oldImage = typeof categoryExists.image === 'string'
                ? JSON.parse(categoryExists.image)
                : categoryExists.image;
            if (oldImage && oldImage.fileName) {
                await this.filesService.deletePublicFile(oldImage.fileName);
            }
            imageData = null;
        }
        const updatedCategory = await this.prismaService.category.update({
            where: { id },
            data: {
                ...updateCategoryDto,
                slug: newSlug,
                image: imageData
            },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });
        return updatedCategory;
    }
    async remove(id) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: { children: true }
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete a category that has children. Delete children first or reassign them.');
        }
        if (category.image) {
            try {
                const image = typeof category.image === 'string'
                    ? JSON.parse(category.image)
                    : category.image;
                if (image && image.fileName) {
                    await this.filesService.deletePublicFile(image.fileName);
                }
            }
            catch (error) {
                console.error('Error deleting category image:', error);
            }
        }
        await this.prismaService.category.delete({
            where: { id }
        });
    }
    async isChildOf(potentialChild, parentId) {
        const category = await this.prismaService.category.findUnique({
            where: { id: potentialChild },
            select: { parentId: true }
        });
        if (!category || category.parentId === null) {
            return false;
        }
        if (category.parentId === parentId) {
            return true;
        }
        return this.isChildOf(category.parentId, parentId);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_util_1.PaginationService,
        file_service_1.FilesService])
], CategoryService);
//# sourceMappingURL=category.service.js.map