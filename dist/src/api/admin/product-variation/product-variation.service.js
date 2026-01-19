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
exports.ProductVariationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
const file_service_1 = require("../../../services/file/file.service");
let ProductVariationService = class ProductVariationService {
    constructor(prisma, filesService) {
        this.prisma = prisma;
        this.filesService = filesService;
    }
    async create(productId, createProductVariationDto, images) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        const existingSku = await this.prisma.productVariation.findUnique({
            where: { sku: createProductVariationDto.sku },
        });
        if (existingSku) {
            throw new common_1.HttpException('SKU already exists', common_1.HttpStatus.BAD_REQUEST);
        }
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
                throw new common_1.HttpException(`Attribute value with ID ${attributeId} not found or doesn't belong to this product`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (createProductVariationDto.isDefault) {
            await this.prisma.productVariation.updateMany({
                where: { productId },
                data: { isDefault: false },
            });
        }
        let uploadedImages;
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(images.map((image) => this.filesService.uploadFile(image.buffer, image.originalname, 'product-variation', 'image')));
        }
        const productVariation = await this.prisma.productVariation.create({
            data: {
                productId,
                sku: createProductVariationDto.sku,
                price: createProductVariationDto.price,
                percentOff: createProductVariationDto.percentOff,
                inventory: createProductVariationDto.inventory || 0,
                images: uploadedImages,
                isDefault: createProductVariationDto.isDefault || false,
                status: createProductVariationDto.status || client_1.CommonStatus.ACTIVE,
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
    async findAll(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
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
    async findOne(productId, id) {
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
            throw new common_1.HttpException('Product variation not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.transformVariationData(variation);
    }
    async update(productId, id, updateProductVariationDto, images) {
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
            throw new common_1.HttpException('Product variation not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (updateProductVariationDto.sku) {
            const existingSku = await this.prisma.productVariation.findFirst({
                where: {
                    sku: updateProductVariationDto.sku,
                    id: { not: id },
                },
            });
            if (existingSku) {
                throw new common_1.HttpException('SKU already exists', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        if (updateProductVariationDto.isDefault) {
            await this.prisma.productVariation.updateMany({
                where: {
                    productId,
                    id: { not: id },
                },
                data: { isDefault: false },
            });
        }
        let uploadedImages;
        if (images && images.length > 0) {
            uploadedImages = await Promise.all(images.map((image) => this.filesService.uploadFile(image.buffer, image.originalname, 'product-variation', 'image')));
        }
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
    async remove(productId, id) {
        const productVariation = await this.prisma.productVariation.findFirst({
            where: {
                id,
                productId,
            },
        });
        if (!productVariation) {
            throw new common_1.HttpException('Product variation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const usedInCart = await this.prisma.cartItem.findFirst({
            where: { productVariationId: id },
        });
        if (usedInCart) {
            throw new common_1.HttpException('Cannot delete variation that is in a cart', common_1.HttpStatus.BAD_REQUEST);
        }
        const usedInOrder = await this.prisma.orderItem.findFirst({
            where: { productVariationId: id },
        });
        if (usedInOrder) {
            throw new common_1.HttpException('Cannot delete variation that is in an order', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.productVariation.delete({
            where: { id },
        });
    }
    transformVariationData(variation) {
        const attributes = {};
        if (variation.attributeValues) {
            variation.attributeValues.forEach((av) => {
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
            attributeValues: variation.attributeValues ? variation.attributeValues.map((av) => ({
                id: av.attributeValue?.id,
                name: av.attributeValue?.name,
                value: av.attributeValue?.value,
                attributeId: av.attributeValue?.attribute?.id,
                attributeName: av.attributeValue?.attribute?.name
            })) : []
        };
    }
};
exports.ProductVariationService = ProductVariationService;
exports.ProductVariationService = ProductVariationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_service_1.FilesService])
], ProductVariationService);
//# sourceMappingURL=product-variation.service.js.map