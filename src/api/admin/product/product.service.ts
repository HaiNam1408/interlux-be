import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from 'src/services/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { ProductStatus, CommonStatus } from '@prisma/client';
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
        model3dFile?: Express.Multer.File,
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

        // Upload 3D model if provided
        let modelData = null;
        if (model3dFile) {
            try {
                modelData = await this.filesService.upload3DFile(
                    model3dFile.buffer,
                    model3dFile.originalname,
                    'product/models'
                );
            } catch (error) {
                console.error('Error uploading 3D model:', error);
                throw new Error(`Failed to upload 3D model: ${error.message}`);
            }
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
                model: modelData,
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

        // Chỉ chọn các trường cần thiết
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
            throw new HttpException('Product not found', 404);
        }

        return this.transformProductDetail(product);
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        newImages?: Express.Multer.File[],
        model3dFile?: Express.Multer.File,
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

        // Handle 3D model update
        let modelData = undefined;
        if (updateProductDto.removeModel) {
            if (product.model) {
                const currentModel = typeof product.model === 'string'
                    ? JSON.parse(product.model as string)
                    : product.model as any;

                if (currentModel && currentModel.fileName) {
                    try {
                        await this.filesService.deletePublicFile(currentModel.fileName);
                    } catch (error) {
                        console.error(`Failed to delete 3D model file ${currentModel.fileName}:`, error);
                    }
                }
            }
            modelData = null;
        }
        // If a new model is uploaded, replace the existing one
        else if (model3dFile) {
            // Delete existing model if there is one
            if (product.model) {
                const currentModel = typeof product.model === 'string'
                    ? JSON.parse(product.model as string)
                    : product.model as any;

                if (currentModel && currentModel.fileName) {
                    try {
                        await this.filesService.deletePublicFile(currentModel.fileName);
                    } catch (error) {
                        console.error(`Failed to delete old 3D model file ${currentModel.fileName}:`, error);
                    }
                }
            }

            // Upload new model
            try {
                modelData = await this.filesService.upload3DFile(
                    model3dFile.buffer,
                    model3dFile.originalname,
                    'product/models'
                );
            } catch (error) {
                console.error('Error uploading 3D model:', error);
                throw new Error(`Failed to upload 3D model: ${error.message}`);
            }
        }

        let attributes = undefined;
        if (updateProductDto.attributes !== undefined) {
            attributes = typeof updateProductDto.attributes === 'string'
                ? JSON.parse(updateProductDto.attributes as string)
                : updateProductDto.attributes;
        }

        const updateData: any = {
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
        };

        // Only include model in update if it's been changed
        if (modelData !== undefined) {
            updateData.model = modelData;
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: updateData,
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
            if (product.model) {
                const modelData = typeof product.model === 'string'
                    ? JSON.parse(product.model as string)
                    : product.model as any;

                if (modelData && modelData.fileName) {
                    try {
                        await this.filesService.deletePublicFile(modelData.fileName);
                    } catch (error) {
                        console.error(`Failed to delete 3D model file ${modelData.fileName}:`, error);
                    }
                }
            }

            // Delete product images
            if (product.images) {
                const imagesData = typeof product.images === 'string'
                    ? JSON.parse(product.images as string)
                    : product.images as any[];

                if (imagesData && imagesData.length > 0) {
                    for (const image of imagesData) {
                        if (image && image.fileName) {
                            try {
                                await this.filesService.deletePublicFile(image.fileName);
                            } catch (error) {
                                console.error(`Failed to delete image file ${image.fileName}:`, error);
                            }
                        }
                    }
                }
            }

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
                    attributes: updatedAttributes,
                    model: null
                }
            });
        });
    }

    // Helper method để chuyển đổi dữ liệu sản phẩm chi tiết
    private transformProductDetail(product: any): any {
        if (product.images) {
            product.images = typeof product.images === 'string'
                ? JSON.parse(product.images as string)
                : product.images;
        }

        if (product.model) {
            product.model = typeof product.model === 'string'
                ? JSON.parse(product.model as string)
                : product.model;
        }

        if (product.attributes) {
            product.attributes = typeof product.attributes === 'string'
                ? JSON.parse(product.attributes as string)
                : product.attributes;
        }

        if (product.percentOff && product.percentOff > 0) {
            product.finalPrice = product.price * (1 - product.percentOff / 100);
        } else {
            product.finalPrice = product.price;
        }

        if (product.variations) {
            product.variations = product.variations.map(variation => {
                if (variation.images) {
                    variation.images = typeof variation.images === 'string'
                        ? JSON.parse(variation.images as string)
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
}