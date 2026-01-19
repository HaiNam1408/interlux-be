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
exports.ProductClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const client_1 = require("@prisma/client");
const table_enum_1 = require("../../../common/enums/table.enum");
let ProductClientService = class ProductClientService {
    constructor(prisma, pagination) {
        this.prisma = prisma;
        this.pagination = pagination;
    }
    async findAll(params) {
        const { page = 1, limit = 10, categoryId, search, sortBy = 'createdAt', sortDirection = 'desc', minPrice, maxPrice, attributes, } = params;
        const where = {
            status: client_1.ProductStatus.ACTIVE,
        };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = {
                gte: minPrice,
                lte: maxPrice,
            };
        }
        else if (minPrice !== undefined) {
            where.price = { gte: minPrice };
        }
        else if (maxPrice !== undefined) {
            where.price = { lte: maxPrice };
        }
        if (attributes) {
            try {
                const attributesObject = JSON.parse(attributes);
                const attributeConditions = Object.entries(attributesObject).map(([key, value]) => ({
                    attributes: {
                        path: ['$.' + key],
                        equals: value,
                    },
                }));
                if (attributeConditions.length > 0) {
                    where.AND = where.AND || [];
                    where.AND.push(...attributeConditions);
                }
            }
            catch (e) {
            }
        }
        const select = {
            id: true,
            title: true,
            slug: true,
            price: true,
            percentOff: true,
            sold: true,
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            variations: {
                where: { status: 'ACTIVE' },
                select: {
                    id: true,
                    sku: true,
                    price: true,
                    percentOff: true,
                    inventory: true,
                    images: true,
                    isDefault: true,
                },
            },
            createdAt: true,
        };
        const orderBy = {};
        orderBy[sortBy] = sortDirection;
        const paginate = await this.pagination.paginate(table_enum_1.TableName.PRODUCT, { page, limit }, where, select, [orderBy]);
        if (paginate.data && paginate.data.length > 0) {
            paginate.data = paginate.data.map((product) => this.transformProductData(product));
        }
        return paginate;
    }
    async findBySlug(id) {
        const product = await this.prisma.product.findUnique({
            where: { id, status: client_1.ProductStatus.ACTIVE },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                price: true,
                percentOff: true,
                sold: true,
                images: true,
                attributes: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        parent: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                productAttributes: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        values: {
                            select: {
                                id: true,
                                name: true,
                                value: true,
                                slug: true
                            }
                        }
                    }
                },
                variations: {
                    where: { status: 'ACTIVE' },
                    select: {
                        id: true,
                        sku: true,
                        price: true,
                        percentOff: true,
                        inventory: true,
                        images: true,
                        isDefault: true,
                        attributeValues: {
                            select: {
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
                    },
                },
                createdAt: true,
                updatedAt: true
            },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.transformProductData(product);
    }
    async getFeaturedProducts() {
        const featuredProducts = await this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.ACTIVE,
                percentOff: { gt: 0 },
            },
            orderBy: [{ percentOff: 'desc' }],
            take: 8,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return featuredProducts.map(product => this.transformProductData(product));
    }
    async getBestSellingProducts() {
        const bestSellers = await this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.ACTIVE,
                sold: { gt: 0 },
            },
            orderBy: [{ sold: 'desc' }],
            take: 8,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return bestSellers.map(product => this.transformProductData(product));
    }
    async getNewArrivals() {
        const newArrivals = await this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.ACTIVE,
            },
            orderBy: [{ createdAt: 'desc' }],
            take: 8,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return newArrivals.map(product => this.transformProductData(product));
    }
    async getRelatedProducts(productId) {
        const currentProduct = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { categoryId: true },
        });
        if (!currentProduct) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        const relatedProducts = await this.prisma.product.findMany({
            where: {
                categoryId: currentProduct.categoryId,
                status: client_1.ProductStatus.ACTIVE,
                id: { not: productId },
            },
            take: 8,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
        return relatedProducts.map(product => this.transformProductData(product));
    }
    async getProductsByCategory(categorySlug, params) {
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: true },
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        const categoryIds = [category.id, ...category.children.map((child) => child.id)];
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortDirection = 'desc', minPrice, maxPrice, attributes, } = params;
        return this.findAll({
            page,
            limit,
            categoryId: undefined,
            search,
            sortBy,
            sortDirection,
            minPrice,
            maxPrice,
            attributes,
        });
    }
    async getProductVariations(productId) {
        const variations = await this.prisma.productVariation.findMany({
            where: {
                productId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                sku: true,
                price: true,
                percentOff: true,
                inventory: true,
                images: true,
                isDefault: true,
                attributeValues: {
                    select: {
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
            },
        });
        if (variations.length === 0) {
            throw new common_1.HttpException('No variations found for this product', common_1.HttpStatus.NOT_FOUND);
        }
        return variations.map(variation => this.transformVariationData(variation));
    }
    async getVariationBySku(sku) {
        const variation = await this.prisma.productVariation.findUnique({
            where: {
                sku,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                sku: true,
                price: true,
                percentOff: true,
                inventory: true,
                images: true,
                isDefault: true,
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                attributeValues: {
                    select: {
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
            },
        });
        if (!variation) {
            throw new common_1.HttpException('Variation not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.transformVariationData(variation);
    }
    async getAvailableFilters(categorySlug) {
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: true },
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        const categoryIds = [category.id, ...category.children.map(child => child.id)];
        const products = await this.prisma.product.findMany({
            where: {
                categoryId: { in: categoryIds },
                status: client_1.ProductStatus.ACTIVE,
            },
            select: {
                price: true,
                attributes: true,
            },
        });
        let minPrice = Infinity;
        let maxPrice = 0;
        const attributesMap = new Map();
        for (const product of products) {
            if (product.price < minPrice)
                minPrice = product.price;
            if (product.price > maxPrice)
                maxPrice = product.price;
            if (product.attributes) {
                try {
                    const attrs = JSON.parse(product.attributes);
                    Object.entries(attrs).forEach(([key, value]) => {
                        if (!attributesMap.has(key)) {
                            attributesMap.set(key, new Set());
                        }
                        attributesMap.get(key).add(value);
                    });
                }
                catch (e) {
                }
            }
        }
        const attributes = {};
        attributesMap.forEach((values, key) => {
            attributes[key] = Array.from(values);
        });
        return {
            priceRange: {
                min: minPrice !== Infinity ? minPrice : 0,
                max: maxPrice
            },
            attributes,
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                children: category.children.map(child => ({
                    id: child.id,
                    name: child.name,
                    slug: child.slug,
                })),
            },
        };
    }
    transformProductData(product) {
        const transformed = { ...product };
        if (transformed.images) {
            transformed.images = typeof transformed.images === 'string'
                ? JSON.parse(transformed.images)
                : transformed.images;
        }
        if (transformed.attributes) {
            transformed.attributes = typeof transformed.attributes === 'string'
                ? JSON.parse(transformed.attributes)
                : transformed.attributes;
        }
        if (transformed.variations) {
            transformed.variations = transformed.variations.map((variation) => this.transformVariationData(variation));
        }
        if (transformed.percentOff && transformed.percentOff > 0) {
            transformed.finalPrice = transformed.price * (1 - transformed.percentOff / 100);
        }
        else {
            transformed.finalPrice = transformed.price;
        }
        return transformed;
    }
    transformVariationData(variation) {
        const transformed = { ...variation };
        if (transformed.images) {
            transformed.images = typeof transformed.images === 'string'
                ? JSON.parse(transformed.images)
                : transformed.images;
        }
        if (transformed.attributeValues) {
            const groupedAttributes = {};
            transformed.attributeValues.forEach((av) => {
                const attribute = av.attributeValue.attribute;
                const attributeName = attribute.name;
                if (!groupedAttributes[attributeName]) {
                    groupedAttributes[attributeName] = {
                        id: attribute.id,
                        name: attributeName,
                        values: []
                    };
                }
                groupedAttributes[attributeName].values.push({
                    id: av.attributeValue.id,
                    name: av.attributeValue.name,
                    value: av.attributeValue.value
                });
            });
            transformed.groupedAttributes = Object.values(groupedAttributes);
            delete transformed.attributeValues;
        }
        if (transformed.percentOff && transformed.percentOff > 0) {
            transformed.finalPrice = transformed.price * (1 - transformed.percentOff / 100);
        }
        else {
            transformed.finalPrice = transformed.price;
        }
        return transformed;
    }
};
exports.ProductClientService = ProductClientService;
exports.ProductClientService = ProductClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_util_1.PaginationService])
], ProductClientService);
//# sourceMappingURL=product.service.js.map