import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationService } from 'src/utils/pagination.util';
import { PostStatus } from '@prisma/client';
import { SlugUtil } from 'src/utils/createSlug.util';
import { FilesService } from 'src/services/file/file.service';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class BlogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagination: PaginationService,
        private readonly filesService: FilesService
    ) { }

    async findAll(page: number = 1, limit: number = 10, status?: PostStatus, search?: string, tagId?: number): Promise<any> {
        const where: any = {};
        
        if (status) {
            where.status = status;
        }
        
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (tagId) {
            where.tags = {
                some: {
                    tagId: tagId
                }
            };
        }

        const select = {
            id: true,
            title: true,
            slug: true,
            description: true,
            thumbnail: true,
            status: true,
            view: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            }
        };

        const orderBy = [{ createdAt: 'desc' }];

        return await this.pagination.paginate(
            TableName.POST,
            { page, limit },
            where,
            select,
            orderBy
        );
    }

    async findOne(id: number): Promise<any> {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return {
            ...post,
            tags: post.tags.map(tag => tag.tag)
        };
    }

    async findBySlug(slug: string): Promise<any> {
        const post = await this.prisma.post.findUnique({
            where: { slug },
            include: {
                tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }

        return {
            ...post,
            tags: post.tags.map(tag => tag.tag)
        };
    }

    async create(createPostDto: CreatePostDto, thumbnail?: Express.Multer.File): Promise<any> {
        const slug = SlugUtil.createSlug(createPostDto.title);
        
        const existingPost = await this.prisma.post.findUnique({
            where: { slug }
        });

        if (existingPost) {
            throw new BadRequestException(`A post with the slug "${slug}" already exists`);
        }

        let thumbnailData = null;
        if (thumbnail) {
            thumbnailData = await this.filesService.uploadFile(
                thumbnail.buffer,
                thumbnail.originalname,
                'blog',
                'image'
            );
        }

        const post = await this.prisma.post.create({
            data: {
                title: createPostDto.title,
                slug,
                description: createPostDto.description,
                content: createPostDto.content,
                metaTitle: createPostDto.metaTitle,
                metaDescription: createPostDto.metaDescription,
                status: createPostDto.status || PostStatus.DRAFT,
                publishedAt: createPostDto.status === PostStatus.PUBLISHED ? 
                    (createPostDto.publishedAt || new Date()) : null,
                thumbnail: thumbnailData ? JSON.stringify(thumbnailData) : null,
            }
        });

        if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
            await this.prisma.postTag.createMany({
                data: createPostDto.tagIds.map(tagId => ({
                    postId: post.id,
                    tagId
                }))
            });
        }

        return this.findOne(post.id);
    }

    async update(id: number, updatePostDto: UpdatePostDto, thumbnail?: Express.Multer.File): Promise<any> {
        const existingPost = await this.prisma.post.findUnique({
            where: { id }
        });

        if (!existingPost) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        let slug = existingPost.slug;
        if (updatePostDto.title) {
            slug = SlugUtil.createSlug(updatePostDto.title);
            
            const postWithSlug = await this.prisma.post.findFirst({
                where: {
                    slug,
                    id: { not: id }
                }
            });

            if (postWithSlug) {
                throw new BadRequestException(`A post with the slug "${slug}" already exists`);
            }
        }

        // Handle thumbnail
        let thumbnailData = existingPost.thumbnail;
        if (updatePostDto.removeThumbnail) {
            thumbnailData = null;
        } else if (thumbnail) {
            thumbnailData = await this.filesService.uploadFile(
                thumbnail.buffer,
                thumbnail.originalname,
                'blog',
                'image'
            );
        }

        // Update post
        const updateData: any = {
            ...(updatePostDto.title && { title: updatePostDto.title }),
            ...(updatePostDto.title && { slug }),
            ...(updatePostDto.description !== undefined && { description: updatePostDto.description }),
            ...(updatePostDto.content && { content: updatePostDto.content }),
            ...(updatePostDto.metaTitle !== undefined && { metaTitle: updatePostDto.metaTitle }),
            ...(updatePostDto.metaDescription !== undefined && { metaDescription: updatePostDto.metaDescription }),
            ...(updatePostDto.status && { status: updatePostDto.status }),
            thumbnail: thumbnailData,
        };

        if (updatePostDto.status === PostStatus.PUBLISHED && existingPost.status !== PostStatus.PUBLISHED) {
            updateData.publishedAt = updatePostDto.publishedAt || new Date();
        }

        await this.prisma.post.update({
            where: { id },
            data: updateData
        });

        if (updatePostDto.tagIds) {
            await this.prisma.postTag.deleteMany({
                where: { postId: id }
            });

            if (updatePostDto.tagIds.length > 0) {
                await this.prisma.postTag.createMany({
                    data: updatePostDto.tagIds.map(tagId => ({
                        postId: id,
                        tagId
                    }))
                });
            }
        }

        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const post = await this.prisma.post.findUnique({
            where: { id }
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        await this.prisma.postTag.deleteMany({
            where: { postId: id }
        });

        await this.prisma.post.delete({
            where: { id }
        });
    }

    async incrementView(id: number): Promise<void> {
        await this.prisma.post.update({
            where: { id },
            data: {
                view: {
                    increment: 1
                }
            }
        });
    }
}
