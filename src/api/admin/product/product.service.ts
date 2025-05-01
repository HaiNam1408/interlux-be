import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from 'src/services/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { Product, ProductStatus, CommonStatus } from '@prisma/client';
import { SlugUtil } from 'src/utils/createSlug.util';
import { PaginationService } from 'src/utils/pagination.util';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly filesService: FilesService,
        private readonly pagination: PaginationService
    ) { }

    async create(
        createProductDto: CreateProductDto,
        images: Express.Multer.File[],
    ): Promise<any> {
        const category = await this.prisma.category.findFirst({
            where: { id: createProductDto.categoryId },
        });

        if (!category) {
            throw new Error('Category not found');
        }

        const slug = SlugUtil.createSlug(createProductDto.title);
        const existingProductWithSlug = await this.prisma.product.findFirst({
            where: { slug },
        });

        if (existingProductWithSlug) {
            throw new Error('Slug already exists');
        }

        let uploadedImages = [];
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(
                images.map((image) =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product',
                        'image',
                    ),
                ),
            );
        }

        const attributes = typeof createProductDto.attributes === 'string'
            ? JSON.parse(createProductDto.attributes as string)
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
                status: createProductDto.status || ProductStatus.DRAFT,
            }
        });

        return newProduct;
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        status?: ProductStatus,
        categoryId?: number,
        search?: string,
        includeInactive: boolean = false
    ): Promise<any> {
        const where = {};

        if (status) {
            where['status'] = {status};
        } else if (!includeInactive) {
            where['status'] = { not: ProductStatus.INACTIVE };
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
            description: true,
            price: true,
            percentOff: true,
            attributes: true,
            images: true,
            sort: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            category: true
        };

        const orderBy = [{ sort: 'asc' } ,{ createdAt: 'desc' }];

        return await this.pagination.paginate(
            TableName.PRODUCT,
            { page, limit },
            where,
            select,
            orderBy
        );
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id, status: { not: ProductStatus.INACTIVE } },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    },
                },
                variations: {
                    include: {
                        options: {
                            select: {
                                id: true,
                                variationOption: {
                                    select: {
                                        id: true,
                                        name: true,
                                        value: true,
                                        variation: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }
            },
        });

        if (!product) {
            throw new HttpException('Product not found', 404);
        }

        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        newImages?: Express.Multer.File[],
    ) {
        const product = await this.prisma.product.findUnique({
            where: { id, status: { not: ProductStatus.INACTIVE } },
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
            ? SlugUtil.createSlug(updateProductDto.title)
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
                    ? JSON.parse(product.images as string)
                    : product.images as any[];
            }
    
            if (imagesToDelete && imagesToDelete.length > 0) {
                try {
                    const fileNamesToDelete = imagesToDelete.map(img =>
                        typeof img === 'string' ? img : (img as any).fileName
                    ).filter(Boolean);
                    const imagesToRemove = currentImages.filter(img =>
                        fileNamesToDelete.includes(img.fileName)
                    );
    
                    if (imagesToRemove.length > 0) {
                        for (const image of imagesToRemove) {
                            if (image && image.fileName) {
                                try {
                                    await this.filesService.deletePublicFile(image.fileName);
                                } catch (error) {
                                    console.error(`Failed to delete file ${image.fileName}:`, error);
                                }
                            }
                        }
                    }
    
                    currentImages = currentImages.filter(img =>
                        !fileNamesToDelete.includes(img.fileName)
                    );
                } catch (error) {
                    console.error('Error while deleting product images during update:', error);
                }
            }

        }


        if (newImages && newImages.length > 0) {
            const uploadedImages = await Promise.all(
                newImages.map(image =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product',
                        'image',
                    )
                )
            );

            currentImages = [...currentImages, ...uploadedImages];
        }

        let attributes = undefined;
        if (updateProductDto.attributes !== undefined) {
            attributes = typeof updateProductDto.attributes === 'string'
                ? JSON.parse(updateProductDto.attributes as string)
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

    async updateStatus(id: number, status: ProductStatus) {
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

    async remove(id: number): Promise<void> {
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
                            status: CommonStatus.INACTIVE
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
                    status: ProductStatus.INACTIVE,
                    attributes: updatedAttributes
                }
            });
        });
    }
}