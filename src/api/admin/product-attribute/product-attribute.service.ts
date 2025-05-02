import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommonStatus } from '@prisma/client';
import { SlugUtil } from 'src/utils/createSlug.util';
import {
    CreateProductAttributeDto,
    UpdateProductAttributeDto,
    CreateProductAttributeValueDto,
    UpdateProductAttributeValueDto
} from './dto';

@Injectable()
export class ProductAttributeService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        productId: number,
        createProductAttributeDto: CreateProductAttributeDto,
    ): Promise<any> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        const slug = SlugUtil.createSlug(createProductAttributeDto.name);

        const existingAttribute = await this.prisma.productAttribute.findFirst({
            where: {
                productId,
                slug
            },
        });

        if (existingAttribute) {
            throw new HttpException(
                `Attribute with name "${createProductAttributeDto.name}" already exists for this product`,
                HttpStatus.BAD_REQUEST
            );
        }

        // Create the attribute with its values
        const attribute = await this.prisma.productAttribute.create({
            data: {
                productId,
                name: createProductAttributeDto.name,
                slug,
                sort: createProductAttributeDto.sort,
                status: createProductAttributeDto.status || CommonStatus.ACTIVE,
                values: createProductAttributeDto.values ? {
                    create: createProductAttributeDto.values.map(value => ({
                        name: value.name,
                        slug: SlugUtil.createSlug(value.name),
                        value: value.value,
                        sort: value.sort,
                        status: value.status || CommonStatus.ACTIVE,
                    })),
                } : undefined,
            },
            include: {
                values: true,
            },
        });

        return attribute;
    }

    async findAll(productId: number): Promise<any> {
        // Check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.productAttribute.findMany({
            where: { productId },
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
                    },
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'asc' },
                    ],
                },
            },
            orderBy: [
                { sort: 'asc' },
                { createdAt: 'asc' },
            ],
        });
    }

    async findOne(productId: number, id: number): Promise<any> {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id,
                productId,
            },
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
                    },
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'asc' },
                    ],
                },
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        return attribute;
    }

    async update(
        productId: number,
        id: number,
        updateProductAttributeDto: UpdateProductAttributeDto,
    ): Promise<any> {
        // Check if attribute exists
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        let slug = attribute.slug;
        if (updateProductAttributeDto.name) {
            slug = SlugUtil.createSlug(updateProductAttributeDto.name);

            // Check if another attribute with the same name exists
            const existingAttribute = await this.prisma.productAttribute.findFirst({
                where: {
                    productId,
                    slug,
                    id: { not: id },
                },
            });

            if (existingAttribute) {
                throw new HttpException(
                    `Another attribute with name "${updateProductAttributeDto.name}" already exists for this product`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        return this.prisma.productAttribute.update({
            where: { id },
            data: {
                name: updateProductAttributeDto.name,
                slug,
                sort: updateProductAttributeDto.sort,
                status: updateProductAttributeDto.status,
            },
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
                },
            },
        });
    }

    async remove(productId: number, id: number): Promise<void> {
        // Check if attribute exists
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        // Check if this attribute is used in any product variations
        const usedInVariation = await this.prisma.productVariationValue.findFirst({
            where: {
                attributeValue: {
                    attributeId: id,
                },
            },
        });

        if (usedInVariation) {
            throw new HttpException(
                'Cannot delete attribute that is used in product variations',
                HttpStatus.BAD_REQUEST
            );
        }

        await this.prisma.productAttribute.delete({
            where: { id },
        });
    }

    // Attribute Value methods
    async createValue(
        productId: number,
        attributeId: number,
        createProductAttributeValueDto: CreateProductAttributeValueDto,
    ): Promise<any> {
        // Check if attribute exists and belongs to the product
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        const slug = SlugUtil.createSlug(createProductAttributeValueDto.name);

        // Check if value with same name already exists for this attribute
        const existingValue = await this.prisma.productAttributeValue.findFirst({
            where: {
                attributeId,
                slug
            },
        });

        if (existingValue) {
            throw new HttpException(
                `Value with name "${createProductAttributeValueDto.name}" already exists for this attribute`,
                HttpStatus.BAD_REQUEST
            );
        }

        return this.prisma.productAttributeValue.create({
            data: {
                attributeId,
                name: createProductAttributeValueDto.name,
                slug,
                value: createProductAttributeValueDto.value,
                sort: createProductAttributeValueDto.sort,
                status: createProductAttributeValueDto.status || CommonStatus.ACTIVE,
            },
        });
    }

    async findAllValues(productId: number, attributeId: number): Promise<any> {
        // Check if attribute exists and belongs to the product
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.productAttributeValue.findMany({
            where: { attributeId },
            select: {
                id: true,
                name: true,
                value: true,
                slug: true,
                sort: true,
                status: true
            },
            orderBy: [
                { sort: 'asc' },
                { createdAt: 'asc' },
            ],
        });
    }

    async updateValue(
        productId: number,
        attributeId: number,
        valueId: number,
        updateProductAttributeValueDto: UpdateProductAttributeValueDto,
    ): Promise<any> {
        // Check if attribute exists and belongs to the product
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        // Check if value exists
        const value = await this.prisma.productAttributeValue.findFirst({
            where: {
                id: valueId,
                attributeId,
            },
        });

        if (!value) {
            throw new HttpException('Attribute value not found', HttpStatus.NOT_FOUND);
        }

        let slug = value.slug;
        if (updateProductAttributeValueDto.name) {
            slug = SlugUtil.createSlug(updateProductAttributeValueDto.name);

            // Check if another value with the same name exists
            const existingValue = await this.prisma.productAttributeValue.findFirst({
                where: {
                    attributeId,
                    slug,
                    id: { not: valueId },
                },
            });

            if (existingValue) {
                throw new HttpException(
                    `Another value with name "${updateProductAttributeValueDto.name}" already exists for this attribute`,
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        return this.prisma.productAttributeValue.update({
            where: { id: valueId },
            data: {
                name: updateProductAttributeValueDto.name,
                slug,
                value: updateProductAttributeValueDto.value,
                sort: updateProductAttributeValueDto.sort,
                status: updateProductAttributeValueDto.status,
            },
        });
    }

    async removeValue(
        productId: number,
        attributeId: number,
        valueId: number,
    ): Promise<void> {
        // Check if attribute exists and belongs to the product
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });

        if (!attribute) {
            throw new HttpException('Product attribute not found', HttpStatus.NOT_FOUND);
        }

        // Check if value exists
        const value = await this.prisma.productAttributeValue.findFirst({
            where: {
                id: valueId,
                attributeId,
            },
        });

        if (!value) {
            throw new HttpException('Attribute value not found', HttpStatus.NOT_FOUND);
        }

        // Check if this value is used in any product variations
        const usedInVariation = await this.prisma.productVariationValue.findFirst({
            where: {
                attributeValueId: valueId,
            },
        });

        if (usedInVariation) {
            throw new HttpException(
                'Cannot delete attribute value that is used in product variations',
                HttpStatus.BAD_REQUEST
            );
        }

        await this.prisma.productAttributeValue.delete({
            where: { id: valueId },
        });
    }
}
