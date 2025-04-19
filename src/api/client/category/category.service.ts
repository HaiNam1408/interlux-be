import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommonStatus } from '@prisma/client';
import { FindCategoriesClientDto } from './dto';
import { calculateFinalPrice } from 'src/utils/calculatePrice.util';

@Injectable()
export class CategoryClientService {
    constructor(private readonly prisma: PrismaService) {}

    async getCategoryMenu(): Promise<any> {
        const categories = await this.prisma.category.findMany({
            where: {
                status: CommonStatus.ACTIVE,
                parentId: null,
            },
            orderBy: [
                { sort: 'asc' },
                { name: 'asc' },
            ],
            include: {
                children: {
                    where: { status: CommonStatus.ACTIVE },
                    orderBy: [
                        { sort: 'asc' },
                        { name: 'asc' },
                    ],
                    include: {
                        children: {
                            where: { status: CommonStatus.ACTIVE },
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

    async getFeaturedCategories(): Promise<any> {
        const featuredCategories = await this.prisma.category.findMany({
            where: {
                status: CommonStatus.ACTIVE,
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

        return featuredCategories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            productCount: category._count.product,
        }));
    }

    async findBySlug(slug: string): Promise<any> {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: CommonStatus.ACTIVE,
            },
            include: {
                parent: true,
                children: {
                    where: { status: CommonStatus.ACTIVE },
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
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
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
            images: product.images ? JSON.parse(product.images as string) : [],
            finalPrice: calculateFinalPrice(product.price, product.percentOff)
        }));

        return {
            ...category,
            productCount: category._count.product,
            _count: undefined,
            featuredProducts: transformedProducts
        };
    }

    async getSubcategories(slug: string): Promise<any> {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: CommonStatus.ACTIVE,
            },
            select: { id: true }
        });

        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        const subcategories = await this.prisma.category.findMany({
            where: {
                parentId: category.id,
                status: CommonStatus.ACTIVE,
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

        return subcategories.map(subcategory => ({
            ...subcategory,
            productCount: subcategory._count.product,
            _count: undefined
        }));
    }

    async getCategoryBreadcrumb(slug: string): Promise<any> {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                status: CommonStatus.ACTIVE,
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
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
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

    private formatCategoryForMenu(category: any): any {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            children: category.children.map(child => ({
                id: child.id,
                name: child.name,
                slug: child.slug,
                children: child.children?.map(grandchild => ({
                    id: grandchild.id,
                    name: grandchild.name,
                    slug: grandchild.slug
                })) || []
            }))
        };
    }
}