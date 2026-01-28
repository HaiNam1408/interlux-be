import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { Product, ProductStatus } from '@prisma/client';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class ProductClientService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagination: PaginationService,
    ) { }

    async findAll(params: {
        page?: number;
        limit?: number;
        categoryId?: number;
        categoryIds?: number[];
        search?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        minPrice?: number;
        maxPrice?: number;
        attributes?: string;
    }): Promise<any> {
        const {
            page = 1,
            limit = 10,
            categoryId,
            categoryIds,
            search,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            minPrice,
            maxPrice,
            attributes,
        } = params;

        const where: any = {
            status: ProductStatus.ACTIVE,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (categoryIds) {
            where.categoryId = { in: categoryIds };
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
        } else if (minPrice !== undefined) {
            where.price = { gte: minPrice };
        } else if (maxPrice !== undefined) {
            where.price = { lte: maxPrice };
        }

        // Xử lý lọc theo thuộc tính
        if (attributes) {
            try {
                const attributesObject = JSON.parse(attributes);
                // Xử lý tìm kiếm trong trường JSON attributes
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
            } catch (e) {
                // Bỏ qua nếu không phải JSON hợp lệ
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

        // Thiết lập sắp xếp
        const orderBy: any = {};
        orderBy[sortBy] = sortDirection;

        const paginate = await this.pagination.paginate(
            TableName.PRODUCT,
            { page, limit },
            where,
            select,
            [orderBy],
        );

        if (paginate.data && paginate.data.length > 0) {
            paginate.data = paginate.data.map((product: Product) => this.transformProductData(product));
        }

        return paginate;
    }

    async findBySlug(id: number): Promise<any> {
        const product = await this.prisma.product.findUnique({
            where: { id, status: ProductStatus.ACTIVE },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                price: true,
                percentOff: true,
                sold: true,
                model: true,
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
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return this.transformProductData(product);
    }

    async getFeaturedProducts(): Promise<any> {
        // Lấy các sản phẩm được đánh giá là nổi bật (VD: percentOff > 0)
        const featuredProducts = await this.prisma.product.findMany({
            where: {
                status: ProductStatus.ACTIVE,
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

    async getBestSellingProducts(): Promise<any> {
        // Lấy các sản phẩm bán chạy nhất dựa trên trường sold
        const bestSellers = await this.prisma.product.findMany({
            where: {
                status: ProductStatus.ACTIVE,
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

    async getNewArrivals(): Promise<any> {
        // Lấy các sản phẩm mới nhất
        const newArrivals = await this.prisma.product.findMany({
            where: {
                status: ProductStatus.ACTIVE,
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

    async getRelatedProducts(productId: number): Promise<any> {
        const currentProduct = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { categoryId: true },
        });

        if (!currentProduct) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        // Tìm các sản phẩm trong cùng danh mục
        const relatedProducts = await this.prisma.product.findMany({
            where: {
                categoryId: currentProduct.categoryId,
                status: ProductStatus.ACTIVE,
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

    async getProductsByCategory(
        categorySlug: string,
        params: {
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
            sortDirection?: 'asc' | 'desc';
            minPrice?: number;
            maxPrice?: number;
            attributes?: string;
        },
    ): Promise<any> {
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: true },
        });

        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        const categoryIds = [category.id, ...category.children.map((child: any) => child.id)];

        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortDirection = 'desc',
            minPrice,
            maxPrice,
            attributes,
        } = params;

        return this.findAll({
            page,
            limit,
            categoryIds,
            search,
            sortBy,
            sortDirection,
            minPrice,
            maxPrice,
            attributes,
        });
    }

    async getProductVariations(productId: number): Promise<any> {
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
            throw new HttpException('No variations found for this product', HttpStatus.NOT_FOUND);
        }

        return variations.map(variation => this.transformVariationData(variation));
    }

    async getVariationBySku(sku: string): Promise<any> {
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
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        return this.transformVariationData(variation);
    }

    async getAvailableFilters(categorySlug: string): Promise<any> {
        // Tìm danh mục từ slug
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
            include: { children: true },
        });

        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        // Lấy tất cả ID của danh mục và danh mục con
        const categoryIds = [category.id, ...category.children.map(child => child.id)];

        // Tìm tất cả sản phẩm trong các danh mục này
        const products = await this.prisma.product.findMany({
            where: {
                categoryId: { in: categoryIds },
                status: ProductStatus.ACTIVE,
            },
            select: {
                price: true,
                attributes: true,
            },
        });

        // Khởi tạo bộ lọc giá
        let minPrice = Infinity;
        let maxPrice = 0;

        // Khởi tạo map để lưu trữ tất cả các thuộc tính và giá trị
        const attributesMap = new Map();

        for (const product of products) {
            // Cập nhật giá
            if (product.price < minPrice) minPrice = product.price;
            if (product.price > maxPrice) maxPrice = product.price;

            if (product.attributes) {
                try {
                    const attrs = JSON.parse(product.attributes as string);
                    Object.entries(attrs).forEach(([key, value]) => {
                        if (!attributesMap.has(key)) {
                            attributesMap.set(key, new Set());
                        }
                        attributesMap.get(key).add(value);
                    });
                } catch (e) {
                    // Bỏ qua nếu không phải JSON hợp lệ
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

    // Helper function to transform product data
    private transformProductData(product: any): any {
        const transformed = { ...product };

        // Parse JSON strings to objects
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

        // Transform variations if they exist
        if (transformed.variations) {
            transformed.variations = transformed.variations.map((variation: any) =>
                this.transformVariationData(variation)
            );
        }

        // Calculate final price after discount
        if (transformed.percentOff && transformed.percentOff > 0) {
            transformed.finalPrice = transformed.price * (1 - transformed.percentOff / 100);
        } else {
            transformed.finalPrice = transformed.price;
        }

        return transformed;
    }

    // Helper function to transform variation data
    private transformVariationData(variation: any): any {
        const transformed = { ...variation };

        if (transformed.images) {
            transformed.images = typeof transformed.images === 'string'
                ? JSON.parse(transformed.images)
                : transformed.images;
        }

        // Group attribute values by attribute
        if (transformed.attributeValues) {
            const groupedAttributes = {};

            transformed.attributeValues.forEach((av: any) => {
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

        // Calculate final price after discount
        if (transformed.percentOff && transformed.percentOff > 0) {
            transformed.finalPrice = transformed.price * (1 - transformed.percentOff / 100);
        } else {
            transformed.finalPrice = transformed.price;
        }

        return transformed;
    }
}