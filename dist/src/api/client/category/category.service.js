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
exports.CategoryClientService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
const calculatePrice_util_1 = require("../../../utils/calculatePrice.util");
let CategoryClientService = class CategoryClientService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategoryMenu() {
        const categories = await this.prisma.category.findMany({
            where: {
                status: client_1.CommonStatus.ACTIVE,
                parentId: null,
            },
            orderBy: [
                { sort: 'asc' },
                { name: 'asc' },
            ],
            include: {
                children: {
                    where: { status: client_1.CommonStatus.ACTIVE },
                    orderBy: [
                        { sort: 'asc' },
                        { name: 'asc' },
                    ],
                    include: {
                        children: {
                            where: { status: client_1.CommonStatus.ACTIVE },
                            orderBy: [
                                { sort: 'asc' },
                                { name: 'asc' },
                            ],
                        },
                    },
                },
            },
        });
        return categories.map(category => this.formatCategoryForMenu(category));
    }
    async getFeaturedCategories() {
        const featuredCategories = await this.prisma.category.findMany({
            where: {
                status: client_1.CommonStatus.ACTIVE,
            },
            orderBy: [
                { sort: 'asc' },
                { name: 'asc' },
            ],
            take: 6,
            include: {
                _count: {
                    select: {
                        product: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                },
                product: {
                    where: { status: 'ACTIVE' },
                    take: 1,
                    select: {
                        images: true,
                    }
                }
            }
        });
        return featuredCategories.map(category => {
            let imageData = null;
            if (category['image']) {
                try {
                    imageData = JSON.parse(category['image']);
                }
                catch (e) {
                    imageData = category['image'];
                }
            }
            return {
                id: category.id,
                name: category.name,
                slug: category.slug,
                image: imageData,
                productCount: category._count.product,
            };
        });
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: client_1.CommonStatus.ACTIVE,
            },
            include: {
                parent: true,
                children: {
                    where: { status: client_1.CommonStatus.ACTIVE },
                    orderBy: [
                        { sort: 'asc' },
                        { name: 'asc' },
                    ],
                },
                _count: {
                    select: {
                        product: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                }
            }
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        const featuredProducts = await this.prisma.product.findMany({
            where: {
                categoryId: category.id,
                status: 'ACTIVE',
            },
            take: 8,
            orderBy: { sold: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                percentOff: true,
                images: true,
                sold: true,
            }
        });
        const transformedProducts = featuredProducts.map(product => ({
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
            finalPrice: (0, calculatePrice_util_1.calculateFinalPrice)(product.price, product.percentOff)
        }));
        const imageData = category['image'] ? this.parseImageData(category['image']) : null;
        return {
            ...category,
            image: imageData,
            productCount: category._count.product,
            _count: undefined,
            featuredProducts: transformedProducts
        };
    }
    async getSubcategories(slug) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: client_1.CommonStatus.ACTIVE,
            },
            select: { id: true }
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        const subcategories = await this.prisma.category.findMany({
            where: {
                parentId: category.id,
                status: client_1.CommonStatus.ACTIVE,
            },
            orderBy: [
                { sort: 'asc' },
                { name: 'asc' },
            ],
            include: {
                _count: {
                    select: {
                        product: {
                            where: { status: 'ACTIVE' }
                        }
                    }
                },
            }
        });
        return subcategories.map(subcategory => {
            const imageData = subcategory['image'] ? this.parseImageData(subcategory['image']) : null;
            return {
                ...subcategory,
                image: imageData,
                productCount: subcategory._count.product,
                _count: undefined
            };
        });
    }
    async getCategoryBreadcrumb(slug) {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: client_1.CommonStatus.ACTIVE,
            },
            include: {
                parent: {
                    include: {
                        parent: true
                    }
                }
            }
        });
        if (!category) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        const breadcrumb = [];
        if (category.parent?.parent) {
            breadcrumb.push({
                id: category.parent.parent.id,
                name: category.parent.parent.name,
                slug: category.parent.parent.slug
            });
        }
        if (category.parent) {
            breadcrumb.push({
                id: category.parent.id,
                name: category.parent.name,
                slug: category.parent.slug
            });
        }
        breadcrumb.push({
            id: category.id,
            name: category.name,
            slug: category.slug
        });
        return breadcrumb;
    }
    formatCategoryForMenu(category) {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category['image'] ? this.parseImageData(category['image']) : null,
            children: category.children.map((child) => ({
                id: child.id,
                name: child.name,
                slug: child.slug,
                image: child['image'] ? this.parseImageData(child['image']) : null,
                children: child.children?.map((grandchild) => ({
                    id: grandchild.id,
                    name: grandchild.name,
                    slug: grandchild.slug,
                    image: grandchild['image'] ? this.parseImageData(grandchild['image']) : null
                })) || []
            }))
        };
    }
    parseImageData(imageData) {
        if (!imageData)
            return null;
        try {
            return typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
        }
        catch (e) {
            return imageData;
        }
    }
};
exports.CategoryClientService = CategoryClientService;
exports.CategoryClientService = CategoryClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryClientService);
//# sourceMappingURL=category.service.js.map