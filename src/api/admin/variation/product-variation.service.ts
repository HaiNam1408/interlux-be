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
        // Check if product exists
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

        // Validate all variation options exist
        for (const option of createProductVariationDto.options) {
            const variationOption = await this.prisma.variationOption.findUnique({
                where: { id: option.variationOptionId },
            });

            if (!variationOption) {
                throw new HttpException(
                    `Variation option with ID ${option.variationOptionId} not found`,
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
            },
        });

        // Create the product variation options
        await Promise.all(
            createProductVariationDto.options.map(async (option) => {
                await this.prisma.productVariationOption.create({
                    data: {
                        productVariationId: productVariation.id,
                        variationOptionId: option.variationOptionId,
                    },
                });
            }),
        );

        return this.findOne(productId, productVariation.id);
    }

    async findAll(productId: number): Promise<any> {
        // Check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        const productVariations = await this.prisma.productVariation.findMany({
            where: { productId },
            include: {
                options: {
                    include: {
                        variationOption: {
                            include: {
                                variation: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        });

        return productVariations;
    }

    async findOne(productId: number, id: number): Promise<any> {
        const productVariation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
            include: {
                options: {
                    include: {
                        variationOption: {
                            include: {
                                variation: true,
                            },
                        },
                    },
                },
            },
        });

        if (!productVariation) {
            throw new HttpException('Product variation not found', HttpStatus.NOT_FOUND);
        }

        return productVariation;
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

        // If this is becoming the default variation, unset any existing default
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
        await this.prisma.productVariation.update({
            where: { id },
            data: {
                sku: updateProductVariationDto.sku,
                price: updateProductVariationDto.price,
                percentOff: updateProductVariationDto.percentOff,
                inventory: updateProductVariationDto.inventory,
                images: uploadedImages,
                isDefault: updateProductVariationDto.isDefault,
                status: updateProductVariationDto.status,
            },
        });

        return this.findOne(productId, id);
    }

    async remove(productId: number, id: number): Promise<void> {
        const productVariation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
        });

        if (!productVariation) {
            throw new HttpException('Product variation not found', HttpStatus.NOT_FOUND);
        }

        // Delete product variation options first
        await this.prisma.productVariationOption.deleteMany({
            where: { productVariationId: id },
        });

        // Then delete the product variation
        await this.prisma.productVariation.delete({
            where: { id },
        });
    }
}