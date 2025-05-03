import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { SlugUtil } from 'src/utils/createSlug.util';
import { PaginationService } from 'src/utils/pagination.util';
import { TableName } from 'src/common/enums/table.enum';
import { FilesService } from 'src/services/file/file.service';

@Injectable()
export class CategoryService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pagination: PaginationService,
        private readonly filesService: FilesService
    ) { }

    async findAll(page: number = 1, limit: number = 10, parentId?: number): Promise<any> {
        const where = parentId !== undefined ? { parentId } : { parentId: null };

        const select = {
            id: true,
            name: true,
            slug: true,
            sort: true,
            parentId: true,
            image: true,
            children: {
                select: { id: true, name: true, slug: true, image: true },
                orderBy: [{ sort: 'asc' }, { createdAt: 'desc' }]
            }
        };

        const orderBy = [{ sort: 'asc' }, { createdAt: 'desc' }];

        const paginate = await this.pagination.paginate(
            TableName.CATEGORY,
            { page, limit },
            where,
            select,
            orderBy
        );

        return paginate;
    }

    async findOne(id: number): Promise<any> {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async findBySlug(slug: string): Promise<any> {
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });

        if (!category) {
            throw new NotFoundException(`Category with slug "${slug}" not found`);
        }

        return category;
    }

    async create(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File): Promise<any> {
        if (createCategoryDto.parentId) {
            const parentExists = await this.prismaService.category.findUnique({
                where: { id: createCategoryDto.parentId }
            });

            if (!parentExists) {
                throw new BadRequestException(`Parent category with ID ${createCategoryDto.parentId} not found`);
            }
        }

        const nameExists = await this.prismaService.category.findUnique({
            where: { name: createCategoryDto.name }
        });

        if (nameExists) {
            throw new BadRequestException(`Category with name "${createCategoryDto.name}" already exists`);
        }

        const slug = SlugUtil.createSlug(createCategoryDto.name);
        const slugExists = await this.prismaService.category.findUnique({
            where: { slug }
        });

        if (slugExists) {
            throw new BadRequestException(`Category with slug "${slug}" already exists`);
        }

        let imageData = null;

        // Handle uploaded image if provided
        if (image) {
            imageData = await this.filesService.uploadFile(
                image.buffer,
                image.originalname,
                'categories',
                'image'
            );
        }
        // Use image from DTO if provided and no file was uploaded
        else if (createCategoryDto.image) {
            imageData = createCategoryDto.image;
        }

        const category = await this.prismaService.category.create({
            data: {
                ...createCategoryDto,
                slug,
                image: imageData
            },
            include: {
                parent: true
            }
        });

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto, image?: Express.Multer.File): Promise<any> {
        const categoryExists = await this.prismaService.category.findUnique({
            where: { id }
        });

        if (!categoryExists) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check for circular reference
        if (updateCategoryDto.parentId && updateCategoryDto.parentId === id) {
            throw new BadRequestException('A category cannot be its own parent');
        }

        // Check if the new parent exists
        if (updateCategoryDto.parentId) {
            const parentExists = await this.prismaService.category.findUnique({
                where: { id: updateCategoryDto.parentId }
            });

            if (!parentExists) {
                throw new BadRequestException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
            }

            // Check if the new parent is not a child of this category (prevent circular references)
            const isChild = await this.isChildOf(updateCategoryDto.parentId, id);
            if (isChild) {
                throw new BadRequestException('Cannot set a child category as parent (circular reference)');
            }
        }

        // Check if name already exists (if name is being updated)
        if (updateCategoryDto.name && updateCategoryDto.name !== categoryExists.name) {
            const nameExists = await this.prismaService.category.findUnique({
                where: { name: updateCategoryDto.name }
            });

            if (nameExists) {
                throw new BadRequestException(`Category with name "${updateCategoryDto.name}" already exists`);
            }
        }

        // Check if slug already exists (if slug is being updated)
        const newSlug = SlugUtil.createSlug(updateCategoryDto.name || categoryExists.name);
        if (newSlug && newSlug !== categoryExists.slug) {
            const slugExists = await this.prismaService.category.findUnique({
                where: { slug: newSlug }
            });

            if (slugExists) {
                throw new BadRequestException(`Category with slug "${newSlug}" already exists`);
            }
        }

        let imageData = undefined;
        console.log(updateCategoryDto.image);

        if (image) {
            if (categoryExists.image) {
                const oldImage = typeof categoryExists.image === 'string'
                    ? JSON.parse(categoryExists.image)
                    : categoryExists.image;

                if (oldImage && oldImage.fileName) {
                    await this.filesService.deletePublicFile(oldImage.fileName);
                }
            }

            imageData = await this.filesService.uploadFile(
                image.buffer,
                image.originalname,
                'categories',
                'image'
            );
        }
        // If image is explicitly set to null in DTO, delete old image
        else if (updateCategoryDto.image === "" && categoryExists.image) {
            const oldImage = typeof categoryExists.image === 'string'
                ? JSON.parse(categoryExists.image)
                : categoryExists.image;

            if (oldImage && oldImage.fileName) {
                await this.filesService.deletePublicFile(oldImage.fileName);
            }

            imageData = null;
        }

        const updatedCategory = await this.prismaService.category.update({
            where: { id },
            data: {
                ...updateCategoryDto,
                slug: newSlug,
                image: imageData
            },
            include: {
                parent: true,
                children: {
                    orderBy: [
                        { sort: 'asc' },
                        { createdAt: 'desc' }
                    ]
                }
            }
        });

        return updatedCategory;
    }

    async remove(id: number): Promise<void> {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            include: { children: true }
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (category.children.length > 0) {
            throw new BadRequestException('Cannot delete a category that has children. Delete children first or reassign them.');
        }

        if (category.image) {
            try {
                const image = typeof category.image === 'string'
                    ? JSON.parse(category.image)
                    : category.image;

                if (image && image.fileName) {
                    await this.filesService.deletePublicFile(image.fileName);
                }
            } catch (error) {
                console.error('Error deleting category image:', error);
            }
        }

        await this.prismaService.category.delete({
            where: { id }
        });
    }

    // Helper to check if potentialChild is a child (or grandchild etc.) of parentId
    private async isChildOf(potentialChild: number, parentId: number): Promise<boolean> {
        const category = await this.prismaService.category.findUnique({
            where: { id: potentialChild },
            select: { parentId: true }
        });

        if (!category || category.parentId === null) {
            return false;
        }

        if (category.parentId === parentId) {
            return true;
        }

        return this.isChildOf(category.parentId, parentId);
    }
}