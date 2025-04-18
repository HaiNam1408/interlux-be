import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommonStatus } from '@prisma/client';
import { FindCategoriesClientDto } from './dto';
import { calculateFinalPrice } from 'src/utils/calculatePrice.util';

@Injectable()
export class CategoryClientService {
    constructor(private readonly prisma: PrismaService) {}

    async getCategoryMenu(): Promise<any> {
        // Lấy danh sách danh mục và sắp xếp thành cấu trúc menu
        const categories = await this.prisma.category.findMany({
            where: {
                status: CommonStatus.ACTIVE,
                parentId: null, // Chỉ lấy danh mục cha (cấp cao nhất)
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

        // Định dạng lại dữ liệu để làm menu
        return categories.map(category => this.formatCategoryForMenu(category));
    }

    async getFeaturedCategories(): Promise<any> {
        // Lấy danh mục nổi bật (có thể dựa vào số lượng sản phẩm, thứ tự sắp xếp, v.v.)
        const featuredCategories = await this.prisma.category.findMany({
            where: {
                status: CommonStatus.ACTIVE,
            },
            orderBy: [
                { sort: 'asc' },
                { name: 'asc' },
            ],
            take: 6, // Số lượng danh mục nổi bật hiển thị
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
                    take: 1, // Lấy 1 sản phẩm làm ảnh đại diện
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
            thumbnailImage: category.product.length > 0 && category.product[0].images
                ? JSON.parse(category.product[0].images as string)[0] || null
                : null,
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

        // Lấy một số sản phẩm tiêu biểu của danh mục
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

        // Biến đổi dữ liệu sản phẩm
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
        // Tìm category theo slug
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

        // Lấy danh sách danh mục con
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
                // Có thể thêm truy vấn về danh mục con của subcategory nếu cần
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

        // Thêm danh mục gốc nếu có
        if (category.parent?.parent) {
            breadcrumb.push({
                id: category.parent.parent.id,
                name: category.parent.parent.name,
                slug: category.parent.parent.slug
            });
        }

        // Thêm danh mục cha nếu có
        if (category.parent) {
            breadcrumb.push({
                id: category.parent.id,
                name: category.parent.name,
                slug: category.parent.slug
            });
        }

        // Thêm danh mục hiện tại
        breadcrumb.push({
            id: category.id,
            name: category.name,
            slug: category.slug
        });

        return breadcrumb;
    }

    // Helper method để định dạng category cho menu
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