import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommonStatus } from '@prisma/client';
import { FilesService } from 'src/services/file/file.service';
import { CreateProductVariationDto, UpdateProductVariationDto } from './dto';

@Injectable()
export class ProductVariationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly filesService: FilesService,
    ) { }

    async create(
        productId: number,
        createProductVariationDto: CreateProductVariationDto,
        images: Express.Multer.File[],
    ): Promise<any> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        // Check if SKU already exists
        const existingSku = await this.prisma.productVariation.findUnique({
            where: { sku: createProductVariationDto.sku },
        });

        if (existingSku) {
            throw new HttpException('SKU already exists', HttpStatus.BAD_REQUEST);
        }

        // Validate all attribute values exist and belong to this product
        for (const attributeId of createProductVariationDto.attributeValues) {
            const attributeValue = await this.prisma.productAttributeValue.findFirst({
                where: {
                    id: attributeId,
                    attribute: {
                        productId
                    }
                },
                include: {
                    attribute: true
                }
            });

            if (!attributeValue) {
                throw new HttpException(
                    `Attribute value with ID ${attributeId} not found or doesn't belong to this product`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        // If this is the default variation, unset any existing default
        if (createProductVariationDto.isDefault) {
            await this.prisma.productVariation.updateMany({
                where: { productId },
                data: { isDefault: false },
            });
        }

        // Upload images if any
        let uploadedImages;
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(
                images.map((image) =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product-variation',
                        'image',
                    ),
                ),
            );
        }

        // Create the product variation
        const productVariation = await this.prisma.productVariation.create({
            data: {
                productId,
                sku: createProductVariationDto.sku,
                price: createProductVariationDto.price,
                percentOff: createProductVariationDto.percentOff,
                inventory: createProductVariationDto.inventory || 0,
                images: uploadedImages,
                isDefault: createProductVariationDto.isDefault || false,
                status: createProductVariationDto.status || CommonStatus.ACTIVE,
                attributeValues: {
                    create: createProductVariationDto.attributeValues.map(id => ({
                        attributeValueId: id,
                    })),
                },
            },
            include: {
                attributeValues: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
            },
        });

        return this.transformVariationData(productVariation);
    }

    async findAll(productId: number): Promise<any> {
        // Check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        const variations = await this.prisma.productVariation.findMany({
            where: { productId },
            select: {
                id: true,
                sku: true,
                price: true,
                percentOff: true,
                inventory: true,
                images: true,
                isDefault: true,
                status: true,
                createdAt: true,
                updatedAt: true,
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
            },
            orderBy: { createdAt: 'desc' },
        });

        return variations.map(variation => this.transformVariationData(variation));
    }

    async findOne(productId: number, id: number): Promise<any> {
        const variation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
            select: {
                id: true,
                sku: true,
                price: true,
                percentOff: true,
                inventory: true,
                images: true,
                isDefault: true,
                status: true,
                createdAt: true,
                updatedAt: true,
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
            },
        });

        if (!variation) {
            throw new HttpException('Product variation not found', HttpStatus.NOT_FOUND);
        }

        return this.transformVariationData(variation);
    }

    async update(
        productId: number,
        id: number,
        updateProductVariationDto: UpdateProductVariationDto,
        images: Express.Multer.File[],
    ): Promise<any> {
        // Check if product variation exists
        const productVariation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
            include: {
                attributeValues: true,
            },
        });

        if (!productVariation) {
            throw new HttpException('Product variation not found', HttpStatus.NOT_FOUND);
        }

        // Check if SKU already exists
        if (updateProductVariationDto.sku) {
            const existingSku = await this.prisma.productVariation.findFirst({
                where: {
                    sku: updateProductVariationDto.sku,
                    id: { not: id },
                },
            });

            if (existingSku) {
                throw new HttpException('SKU already exists', HttpStatus.BAD_REQUEST);
            }
        }

        // If this is the default variation, unset any existing default
        if (updateProductVariationDto.isDefault) {
            await this.prisma.productVariation.updateMany({
                where: {
                    productId,
                    id: { not: id },
                },
                data: { isDefault: false },
            });
        }

        // Upload images if any
        let uploadedImages;
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(
                images.map((image) =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product-variation',
                        'image',
                    ),
                ),
            );
        }

        // Update the product variation
        const updatedVariation = await this.prisma.productVariation.update({
            where: { id },
            data: {
                sku: updateProductVariationDto.sku,
                price: updateProductVariationDto.price,
                percentOff: updateProductVariationDto.percentOff,
                inventory: updateProductVariationDto.inventory,
                images: uploadedImages ? uploadedImages : undefined,
                isDefault: updateProductVariationDto.isDefault,
                status: updateProductVariationDto.status,
            },
            include: {
                attributeValues: {
                    include: {
                        attributeValue: {
                            include: {
                                attribute: true,
                            },
                        },
                    },
                },
            },
        });

        return this.transformVariationData(updatedVariation);
    }

    async remove(productId: number, id: number): Promise<void> {
        // Check if product variation exists
        const productVariation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
        });

        if (!productVariation) {
            throw new HttpException('Product variation not found', HttpStatus.NOT_FOUND);
        }

        // Check if this variation is used in any cart or order
        const usedInCart = await this.prisma.cartItem.findFirst({
            where: { productVariationId: id },
        });

        if (usedInCart) {
            throw new HttpException(
                'Cannot delete variation that is in a cart',
                HttpStatus.BAD_REQUEST
            );
        }

        const usedInOrder = await this.prisma.orderItem.findFirst({
            where: { productVariationId: id },
        });

        if (usedInOrder) {
            throw new HttpException(
                'Cannot delete variation that is in an order',
                HttpStatus.BAD_REQUEST
            );
        }

        // Delete the product variation
        await this.prisma.productVariation.delete({
            where: { id },
        });
    }

    // Helper method to transform variation data for response
    private transformVariationData(variation: any): any {
        // Group attributes and values
        const attributes: Record<string, any> = {};

        if (variation.attributeValues) {
            variation.attributeValues.forEach((av: any) => {
                if (av.attributeValue && av.attributeValue.attribute) {
                    const attribute = av.attributeValue.attribute;

                    if (!attributes[attribute.id]) {
                        attributes[attribute.id] = {
                            id: attribute.id,
                            name: attribute.name,
                            values: []
                        };
                    }

                    attributes[attribute.id].values.push({
                        id: av.attributeValue.id,
                        name: av.attributeValue.name,
                        value: av.attributeValue.value
                    });
                }
            });
        }

        return {
            id: variation.id,
            sku: variation.sku,
            price: variation.price,
            percentOff: variation.percentOff,
            inventory: variation.inventory,
            images: variation.images,
            isDefault: variation.isDefault,
            status: variation.status,
            createdAt: variation.createdAt,
            updatedAt: variation.updatedAt,
            attributes: Object.values(attributes),
            attributeValues: variation.attributeValues ? variation.attributeValues.map((av: any) => ({
                id: av.attributeValue?.id,
                name: av.attributeValue?.name,
                value: av.attributeValue?.value,
                attributeId: av.attributeValue?.attribute?.id,
                attributeName: av.attributeValue?.attribute?.name
            })) : []
        };
    }
}
