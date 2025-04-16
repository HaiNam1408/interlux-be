import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CommonStatus } from '@prisma/client';
import { SlugUtil } from 'src/utils/createSlug.util';
import { PaginationService } from 'src/utils/pagination.util';
import { TableName } from 'src/common/enums/table.enum';
import { CreateVariationDto, CreateVariationOptionDto, UpdateVariationDto, UpdateVariationOptionDto } from './dto';

@Injectable()
export class VariationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagination: PaginationService,
    ) { }

    async create(createVariationDto: CreateVariationDto): Promise<any> {
        const slug = SlugUtil.createSlug(createVariationDto.name);
        const existingVariation = await this.prisma.variation.findFirst({
            where: { slug },
        });

        if (existingVariation) {
            throw new HttpException('Variation with this name already exists', HttpStatus.BAD_REQUEST);
        }

        const variation = await this.prisma.variation.create({
            data: {
                name: createVariationDto.name,
                slug,
                sort: createVariationDto.sort,
                status: createVariationDto.status || CommonStatus.ACTIVE,
            },
        });

        if (createVariationDto.options && createVariationDto.options.length > 0) {
            await Promise.all(
                createVariationDto.options.map(async (option) => {
                    const optionSlug = SlugUtil.createSlug(option.name);
                    await this.prisma.variationOption.create({
                        data: {
                            name: option.name,
                            slug: optionSlug,
                            value: option.value,
                            sort: option.sort,
                            status: option.status || CommonStatus.ACTIVE,
                            variationId: variation.id,
                        },
                    });
                }),
            );
        }

        return this.findOne(variation.id);
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        status?: CommonStatus,
        search?: string,
    ): Promise<any> {
        const where = {};

        if (status) {
            where['status'] = status;
        }

        if (search) {
            where['OR'] = [{ name: { contains: search } }];
        }

        const select = {
            id: true,
            name: true,
            slug: true,
            sort: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            options: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    value: true,
                    sort: true,
                    status: true,
                },
                orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }],
            },
        };

        const orderBy = [{ sort: 'asc' }, { createdAt: 'desc' }];

        return this.pagination.paginate(
            TableName.VARIATION,
            { page, limit },
            where,
            select,
            orderBy,
        );
    }

    async findOne(id: number): Promise<any> {
        const variation = await this.prisma.variation.findUnique({
            where: { id },
            include: {
                options: {
                    orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }],
                },
            },
        });

        if (!variation) {
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        return variation;
    }

    async update(id: number, updateVariationDto: UpdateVariationDto): Promise<any> {
        const variation = await this.prisma.variation.findUnique({
            where: { id },
        });

        if (!variation) {
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        let slug = variation.slug;
        if (updateVariationDto.name) {
            slug = SlugUtil.createSlug(updateVariationDto.name);
            const existingVariation = await this.prisma.variation.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });

            if (existingVariation) {
                throw new HttpException('Variation with this name already exists', HttpStatus.BAD_REQUEST);
            }
        }

        await this.prisma.variation.update({
            where: { id },
            data: {
                name: updateVariationDto.name,
                slug: updateVariationDto.name ? slug : undefined,
                sort: updateVariationDto.sort,
                status: updateVariationDto.status,
            },
        });

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const variation = await this.prisma.variation.findUnique({
            where: { id },
            include: {
                options: {
                    include: {
                        productVariations: true,
                    },
                },
            },
        });

        if (!variation) {
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        // Check if variation is used in any product
        const hasProductVariations = variation.options.some(
            option => option.productVariations && option.productVariations.length > 0
        );

        if (hasProductVariations) {
            throw new HttpException(
                'Cannot delete variation that is used in products',
                HttpStatus.BAD_REQUEST
            );
        }

        // Delete all options first
        await this.prisma.variationOption.deleteMany({
            where: { variationId: id },
        });

        // Then delete the variation
        await this.prisma.variation.delete({
            where: { id },
        });
    }

    // Variation Option methods
    async createOption(variationId: number, createVariationOptionDto: CreateVariationOptionDto): Promise<any> {
        const variation = await this.prisma.variation.findUnique({
            where: { id: variationId },
        });

        if (!variation) {
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        const slug = SlugUtil.createSlug(createVariationOptionDto.name);
        const existingOption = await this.prisma.variationOption.findFirst({
            where: { slug },
        });

        if (existingOption) {
            throw new HttpException('Option with this name already exists', HttpStatus.BAD_REQUEST);
        }

        const option = await this.prisma.variationOption.create({
            data: {
                name: createVariationOptionDto.name,
                slug,
                value: createVariationOptionDto.value,
                sort: createVariationOptionDto.sort,
                status: createVariationOptionDto.status || CommonStatus.ACTIVE,
                variationId,
            },
        });

        return option;
    }

    async findAllOptions(variationId: number): Promise<any> {
        const variation = await this.prisma.variation.findUnique({
            where: { id: variationId },
        });

        if (!variation) {
            throw new HttpException('Variation not found', HttpStatus.NOT_FOUND);
        }

        return this.prisma.variationOption.findMany({
            where: { variationId },
            orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }],
        });
    }

    async findOneOption(variationId: number, id: number): Promise<any> {
        const option = await this.prisma.variationOption.findFirst({
            where: {
                id,
                variationId,
            },
        });

        if (!option) {
            throw new HttpException('Variation option not found', HttpStatus.NOT_FOUND);
        }

        return option;
    }

    async updateOption(
        variationId: number,
        id: number,
        updateVariationOptionDto: UpdateVariationOptionDto,
    ): Promise<any> {
        const option = await this.prisma.variationOption.findFirst({
            where: {
                id,
                variationId,
            },
        });

        if (!option) {
            throw new HttpException('Variation option not found', HttpStatus.NOT_FOUND);
        }

        let slug = option.slug;
        if (updateVariationOptionDto.name) {
            slug = SlugUtil.createSlug(updateVariationOptionDto.name);
            const existingOption = await this.prisma.variationOption.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });

            if (existingOption) {
                throw new HttpException('Option with this name already exists', HttpStatus.BAD_REQUEST);
            }
        }

        await this.prisma.variationOption.update({
            where: { id },
            data: {
                name: updateVariationOptionDto.name,
                slug: updateVariationOptionDto.name ? slug : undefined,
                value: updateVariationOptionDto.value,
                sort: updateVariationOptionDto.sort,
                status: updateVariationOptionDto.status,
            },
        });

        return this.findOneOption(variationId, id);
    }

    async removeOption(variationId: number, id: number): Promise<void> {
        const option = await this.prisma.variationOption.findFirst({
            where: {
                id,
                variationId,
            },
            include: {
                productVariations: true,
            },
        });

        if (!option) {
            throw new HttpException('Variation option not found', HttpStatus.NOT_FOUND);
        }

        // Check if option is used in any product
        if (option.productVariations && option.productVariations.length > 0) {
            throw new HttpException(
                'Cannot delete option that is used in products',
                HttpStatus.BAD_REQUEST
            );
        }

        await this.prisma.variationOption.delete({
            where: { id },
        });
    }
}