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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const file_service_1 = require("../../../services/file/file.service");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
const createSlug_util_1 = require("../../../utils/createSlug.util");
const pagination_util_1 = require("../../../utils/pagination.util");
const table_enum_1 = require("../../../common/enums/table.enum");
let ProductService = class ProductService {
    constructor(prisma, filesService, pagination) {
        this.prisma = prisma;
        this.filesService = filesService;
        this.pagination = pagination;
    }
    async create(createProductDto, images) {
        const category = await this.prisma.category.findFirst({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new Error('Category not found');
        }
        const slug = createSlug_util_1.SlugUtil.createSlug(createProductDto.title);
        const existingProductWithSlug = await this.prisma.product.findFirst({
            where: { slug },
        });
        if (existingProductWithSlug) {
            throw new Error('Slug already exists');
        }
        let uploadedImages = [];
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(images.map((image) => this.filesService.uploadFile(image.buffer, image.originalname, 'product', 'image')));
        }
        const attributes = typeof createProductDto.attributes === 'string'
            ? JSON.parse(createProductDto.attributes)
            : createProductDto.attributes;
        const newProduct = await this.prisma.product.create({
            data: {
                title: createProductDto.title,
                slug,
                description: createProductDto.description,
                price: createProductDto.price,
                percentOff: createProductDto.percentOff,
                attributes: attributes,
                categoryId: createProductDto.categoryId,
                images: uploadedImages,
                sort: createProductDto.sort,
                status: createProductDto.status || client_1.ProductStatus.DRAFT,
            }
        });
        return newProduct;
    }
    async findAll(page = 1, limit = 10, status, categoryId, search, includeInactive = false) {
        const where = {};
        if (status) {
            where['status'] = { status };
        }
        else if (!includeInactive) {
            where['status'] = { not: client_1.ProductStatus.INACTIVE };
        }
        if (categoryId) {
            where['categoryId'] = categoryId;
        }
        if (search) {
            where['OR'] = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }
        const select = {
            id: true,
            title: true,
            slug: true,
            price: true,
            percentOff: true,
            images: true,
            status: true,
            createdAt: true,
            categoryId: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        };
        const orderBy = [{ sort: 'asc' }, { createdAt: 'desc' }];
        return await this.pagination.paginate(table_enum_1.TableName.PRODUCT, { page, limit }, where, select, orderBy);
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id, status: { not: client_1.ProductStatus.INACTIVE } },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    },
                },
                productAttributes: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        sort: true,
                        status: true,
                        values: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                slug: true,
                                sort: true,
                                status: true
                            }
                        }
                    }
                },
                variations: {
                    select: {
                        id: true,
                        sku: true,
                        price: true,
                        percentOff: true,
                        inventory: true,
                        images: true,
                        isDefault: true,
                        status: true,
                        attributeValues: {
                            select: {
                                id: true,
                                attributeValueId: true,
                                attributeValue: {
                                    select: {
                                        id: true,
                                        name: true,
                                        value: true,
                                        attribute: {
                                            select: {
                                                id: true,
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', 404);
        }
        return this.transformProductDetail(product);
    }
    async update(id, updateProductDto, newImages) {
        const product = await this.prisma.product.findUnique({
            where: { id, status: { not: client_1.ProductStatus.INACTIVE } },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new Error('Category not found');
            }
        }
        const newSlug = updateProductDto.title
            ? createSlug_util_1.SlugUtil.createSlug(updateProductDto.title)
            : product.slug;
        if (updateProductDto.title && newSlug !== product.slug) {
            const existingProductWithSlug = await this.prisma.product.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id }
                },
            });
            if (existingProductWithSlug) {
                throw new Error('Slug already exists');
            }
        }
        let currentImages = [];
        if (updateProductDto.imagesToDelete) {
            const imagesToDelete = JSON.parse(updateProductDto.imagesToDelete.toString()) ?? [];
            if (product.images) {
                currentImages = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images;
            }
            if (imagesToDelete && imagesToDelete.length > 0) {
                try {
                    const fileNamesToDelete = imagesToDelete.map(img => typeof img === 'string' ? img : img.fileName).filter(Boolean);
                    const imagesToRemove = currentImages.filter(img => fileNamesToDelete.includes(img.fileName));
                    if (imagesToRemove.length > 0) {
                        for (const image of imagesToRemove) {
                            if (image && image.fileName) {
                                try {
                                    await this.filesService.deletePublicFile(image.fileName);
                                }
                                catch (error) {
                                    console.error(`Failed to delete file ${image.fileName}:`, error);
                                }
                            }
                        }
                    }
                    currentImages = currentImages.filter(img => !fileNamesToDelete.includes(img.fileName));
                }
                catch (error) {
                    console.error('Error while deleting product images during update:', error);
                }
            }
        }
        if (newImages && newImages.length > 0) {
            const uploadedImages = await Promise.all(newImages.map(image => this.filesService.uploadFile(image.buffer, image.originalname, 'product', 'image')));
            currentImages = [...currentImages, ...uploadedImages];
        }
        let attributes = undefined;
        if (updateProductDto.attributes !== undefined) {
            attributes = typeof updateProductDto.attributes === 'string'
                ? JSON.parse(updateProductDto.attributes)
                : updateProductDto.attributes;
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                title: updateProductDto.title !== undefined ? updateProductDto.title : undefined,
                slug: newSlug !== product.slug ? newSlug : undefined,
                description: updateProductDto.description !== undefined ? updateProductDto.description : undefined,
                price: updateProductDto.price !== undefined ? updateProductDto.price : undefined,
                percentOff: updateProductDto.percentOff !== undefined ? updateProductDto.percentOff : undefined,
                attributes: attributes,
                categoryId: updateProductDto.categoryId !== undefined ? updateProductDto.categoryId : undefined,
                sort: updateProductDto.sort !== undefined ? updateProductDto.sort : undefined,
                status: updateProductDto.status !== undefined ? updateProductDto.status : undefined,
                images: currentImages,
            },
        });
        return updatedProduct;
    }
    async updateStatus(id, status) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return await this.prisma.product.update({
            where: { id },
            data: { status },
        });
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                variations: true,
                cartItems: true
            },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        await this.prisma.$transaction(async (prisma) => {
            if (product.variations && product.variations.length > 0) {
                for (const variation of product.variations) {
                    await prisma.productVariation.update({
                        where: { id: variation.id },
                        data: {
                            status: client_1.CommonStatus.INACTIVE
                        }
                    });
                }
            }
            if (product.cartItems && product.cartItems.length > 0) {
                await prisma.cartItem.deleteMany({
                    where: { productId: id }
                });
            }
            const currentAttributes = product.attributes || {};
            const updatedAttributes = {
                ...(typeof currentAttributes === 'object' ? currentAttributes : {}),
                _deleted: {
                    deletedAt: new Date().toISOString(),
                    reason: 'User deleted'
                }
            };
            await prisma.product.update({
                where: { id },
                data: {
                    status: client_1.ProductStatus.INACTIVE,
                    attributes: updatedAttributes
                }
            });
        });
    }
    transformProductDetail(product) {
        if (product.images) {
            product.images = typeof product.images === 'string'
                ? JSON.parse(product.images)
                : product.images;
        }
        if (product.attributes) {
            product.attributes = typeof product.attributes === 'string'
                ? JSON.parse(product.attributes)
                : product.attributes;
        }
        if (product.percentOff && product.percentOff > 0) {
            product.finalPrice = product.price * (1 - product.percentOff / 100);
        }
        else {
            product.finalPrice = product.price;
        }
        if (product.variations) {
            product.variations = product.variations.map(variation => {
                if (variation.images) {
                    variation.images = typeof variation.images === 'string'
                        ? JSON.parse(variation.images)
                        : variation.images;
                }
                const groupedAttributes = {};
                if (variation.attributeValues) {
                    variation.attributeValues.forEach(av => {
                        if (av.attributeValue) {
                            const attribute = av.attributeValue.attribute;
                            if (!groupedAttributes[attribute.id]) {
                                groupedAttributes[attribute.id] = {
                                    id: attribute.id,
                                    name: attribute.name,
                                    values: []
                                };
                            }
                            groupedAttributes[attribute.id].values.push({
                                id: av.attributeValue.id,
                                name: av.attributeValue.name,
                                value: av.attributeValue.value
                            });
                        }
                    });
                }
                let finalPrice = variation.price;
                if (variation.percentOff && variation.percentOff > 0) {
                    finalPrice = variation.price * (1 - variation.percentOff / 100);
                }
                return {
                    id: variation.id,
                    sku: variation.sku,
                    price: variation.price,
                    finalPrice,
                    percentOff: variation.percentOff,
                    inventory: variation.inventory,
                    images: variation.images,
                    isDefault: variation.isDefault,
                    status: variation.status,
                    attributes: Object.values(groupedAttributes)
                };
            });
        }
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_service_1.FilesService,
        pagination_util_1.PaginationService])
], ProductService);
//# sourceMappingURL=product.service.js.map