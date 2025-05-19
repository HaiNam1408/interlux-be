import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PaginationService } from 'src/utils/pagination.util';
import { SlugUtil } from 'src/utils/createSlug.util';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class TagService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagination: PaginationService
    ) { }

    async findAll(page: number = 1, limit: number = 10, search?: string): Promise<any> {
        const where: any = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const select = {
            id: true,
            name: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    posts: true
                }
            }
        };

        const orderBy = [{ createdAt: 'desc' }];

        const result = await this.pagination.paginate(
            TableName.TAG,
            { page, limit },
            where,
            select,
            orderBy
        );

        const transformedData = result.data.map((tag: any) => ({
            ...(tag as object),
            postCount: tag._count.posts,
            _count: undefined
        }));

        return {
            ...result,
            data: transformedData
        };
    }

    async findOne(id: number): Promise<any> {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        return {
            ...tag,
            postCount: tag._count.posts,
            _count: undefined
        };
    }

    async findBySlug(slug: string): Promise<any> {
        const tag = await this.prisma.tag.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        if (!tag) {
            throw new NotFoundException(`Tag with slug ${slug} not found`);
        }

        return {
            ...tag,
            postCount: tag._count.posts,
            _count: undefined
        };
    }

    async create(createTagDto: CreateTagDto): Promise<any> {
        const slug = SlugUtil.createSlug(createTagDto.name);

        const existingTag = await this.prisma.tag.findUnique({
            where: { slug }
        });

        if (existingTag) {
            throw new BadRequestException(`A tag with the slug "${slug}" already exists`);
        }

        const tag = await this.prisma.tag.create({
            data: {
                name: createTagDto.name,
                slug
            }
        });

        return this.findOne(tag.id);
    }

    async update(id: number, updateTagDto: UpdateTagDto): Promise<any> {
        const existingTag = await this.prisma.tag.findUnique({
            where: { id }
        });

        if (!existingTag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        const slug = SlugUtil.createSlug(updateTagDto.name);
        const tagWithSlug = await this.prisma.tag.findFirst({
            where: {
                slug,
                id: { not: id }
            }
        });

        if (tagWithSlug) {
            throw new BadRequestException(`A tag with the slug "${slug}" already exists`);
        }

        await this.prisma.tag.update({
            where: { id },
            data: {
                name: updateTagDto.name,
                slug
            }
        });

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const tag = await this.prisma.tag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        if (!tag) {
            throw new NotFoundException(`Tag with ID ${id} not found`);
        }

        if (tag._count.posts > 0) {
            throw new BadRequestException(`Cannot delete tag with ID ${id} because it is used in ${tag._count.posts} posts`);
        }

        await this.prisma.tag.delete({
            where: { id }
        });
    }

    async getAllTags(): Promise<any[]> {
        return this.prisma.tag.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true
            }
        });
    }
}