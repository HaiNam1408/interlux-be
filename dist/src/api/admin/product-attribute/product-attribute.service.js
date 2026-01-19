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
exports.ProductAttributeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const client_1 = require("@prisma/client");
const createSlug_util_1 = require("../../../utils/createSlug.util");
let ProductAttributeService = class ProductAttributeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(productId, createProductAttributeDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        const slug = createSlug_util_1.SlugUtil.createSlug(createProductAttributeDto.name);
        const existingAttribute = await this.prisma.productAttribute.findFirst({
            where: {
                productId,
                slug
            },
        });
        if (existingAttribute) {
            throw new common_1.HttpException(`Attribute with name "${createProductAttributeDto.name}" already exists for this product`, common_1.HttpStatus.BAD_REQUEST);
        }
        const attribute = await this.prisma.productAttribute.create({
            data: {
                productId,
                name: createProductAttributeDto.name,
                slug,
                sort: createProductAttributeDto.sort,
                status: createProductAttributeDto.status || client_1.CommonStatus.ACTIVE,
                values: createProductAttributeDto.values ? {
                    create: createProductAttributeDto.values.map(value => ({
                        name: value.name,
                        slug: createSlug_util_1.SlugUtil.createSlug(value.name),
                        value: value.value,
                        sort: value.sort,
                        status: value.status || client_1.CommonStatus.ACTIVE,
                    })),
                } : undefined,
            },
            include: {
                values: true,
            },
        });
        return attribute;
    }
    async findAll(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
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
    async findOne(productId, id) {
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
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        return attribute;
    }
    async update(productId, id, updateProductAttributeDto) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        let slug = attribute.slug;
        if (updateProductAttributeDto.name) {
            slug = createSlug_util_1.SlugUtil.createSlug(updateProductAttributeDto.name);
            const existingAttribute = await this.prisma.productAttribute.findFirst({
                where: {
                    productId,
                    slug,
                    id: { not: id },
                },
            });
            if (existingAttribute) {
                throw new common_1.HttpException(`Another attribute with name "${updateProductAttributeDto.name}" already exists for this product`, common_1.HttpStatus.BAD_REQUEST);
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
    async remove(productId, id) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        const usedInVariation = await this.prisma.productVariationValue.findFirst({
            where: {
                attributeValue: {
                    attributeId: id,
                },
            },
        });
        if (usedInVariation) {
            throw new common_1.HttpException('Cannot delete attribute that is used in product variations', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.productAttribute.delete({
            where: { id },
        });
    }
    async createValue(productId, attributeId, createProductAttributeValueDto) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        const slug = createSlug_util_1.SlugUtil.createSlug(createProductAttributeValueDto.name);
        const existingValue = await this.prisma.productAttributeValue.findFirst({
            where: {
                attributeId,
                slug
            },
        });
        if (existingValue) {
            throw new common_1.HttpException(`Value with name "${createProductAttributeValueDto.name}" already exists for this attribute`, common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.productAttributeValue.create({
            data: {
                attributeId,
                name: createProductAttributeValueDto.name,
                slug,
                value: createProductAttributeValueDto.value,
                sort: createProductAttributeValueDto.sort,
                status: createProductAttributeValueDto.status || client_1.CommonStatus.ACTIVE,
            },
        });
    }
    async findAllValues(productId, attributeId) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
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
    async updateValue(productId, attributeId, valueId, updateProductAttributeValueDto) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        const value = await this.prisma.productAttributeValue.findFirst({
            where: {
                id: valueId,
                attributeId,
            },
        });
        if (!value) {
            throw new common_1.HttpException('Attribute value not found', common_1.HttpStatus.NOT_FOUND);
        }
        let slug = value.slug;
        if (updateProductAttributeValueDto.name) {
            slug = createSlug_util_1.SlugUtil.createSlug(updateProductAttributeValueDto.name);
            const existingValue = await this.prisma.productAttributeValue.findFirst({
                where: {
                    attributeId,
                    slug,
                    id: { not: valueId },
                },
            });
            if (existingValue) {
                throw new common_1.HttpException(`Another value with name "${updateProductAttributeValueDto.name}" already exists for this attribute`, common_1.HttpStatus.BAD_REQUEST);
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
    async removeValue(productId, attributeId, valueId) {
        const attribute = await this.prisma.productAttribute.findFirst({
            where: {
                id: attributeId,
                productId,
            },
        });
        if (!attribute) {
            throw new common_1.HttpException('Product attribute not found', common_1.HttpStatus.NOT_FOUND);
        }
        const value = await this.prisma.productAttributeValue.findFirst({
            where: {
                id: valueId,
                attributeId,
            },
        });
        if (!value) {
            throw new common_1.HttpException('Attribute value not found', common_1.HttpStatus.NOT_FOUND);
        }
        const usedInVariation = await this.prisma.productVariationValue.findFirst({
            where: {
                attributeValueId: valueId,
            },
        });
        if (usedInVariation) {
            throw new common_1.HttpException('Cannot delete attribute value that is used in product variations', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.productAttributeValue.delete({
            where: { id: valueId },
        });
    }
};
exports.ProductAttributeService = ProductAttributeService;
exports.ProductAttributeService = ProductAttributeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductAttributeService);
//# sourceMappingURL=product-attribute.service.js.map