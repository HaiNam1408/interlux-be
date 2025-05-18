import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { PostStatus } from '@prisma/client';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class BlogClientService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pagination: PaginationService
    ) { }

    async findAll(page: number = 1, limit: number = 10, search?: string, tagId?: number): Promise<any> {
        const where: any = {
            status: PostStatus.PUBLISHED,
            publishedAt: { lte: new Date() }
        };
        
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
            view: true,
            publishedAt: true,
            createdAt: true,
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

        const orderBy = [{ publishedAt: 'desc' }];

        return await this.pagination.paginate(
            TableName.POST,
            { page, limit },
            where,
            select,
            orderBy
        );
    }

    async findBySlug(slug: string): Promise<any> {
        const post = await this.prisma.post.findFirst({
            where: { 
                slug,
                status: PostStatus.PUBLISHED,
                publishedAt: { lte: new Date() }
            },
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

        await this.prisma.post.update({
            where: { id: post.id },
            data: { view: { increment: 1 } }
        });

        const tagIds = post.tags.map(tag => tag.tag.id);
        
        const relatedPosts = await this.prisma.post.findMany({
            where: {
                id: { not: post.id },
                status: PostStatus.PUBLISHED,
                publishedAt: { lte: new Date() },
                tags: {
                    some: {
                        tagId: { in: tagIds }
                    }
                }
            },
            take: 4,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                thumbnail: true,
                publishedAt: true,
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

        return {
            ...post,
            relatedPosts
        };
    }

    async getPopularPosts(limit: number): Promise<any[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                status: PostStatus.PUBLISHED,
                publishedAt: { lte: new Date() }
            },
            take: limit | 5,
            orderBy: { view: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                publishedAt: true,
                view: true
            }
        });

        return posts;
    }

    async getRecentPosts(limit: number): Promise<any[]> {
        const posts = await this.prisma.post.findMany({
            where: {
                status: PostStatus.PUBLISHED,
                publishedAt: { lte: new Date() }
            },
            take: limit | 5,
            orderBy: { publishedAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                publishedAt: true
            }
        });

        return posts;
    }

    async getAllTags(): Promise<any[]> {
        return this.prisma.tag.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: {
                        posts: {
                            where: {
                                post: {
                                    status: PostStatus.PUBLISHED,
                                    publishedAt: { lte: new Date() }
                                }
                            }
                        }
                    }
                }
            }
        }).then(tags => tags.map(tag => ({
            ...tag,
            postCount: tag._count.posts,
            _count: undefined
        })));
    }
}