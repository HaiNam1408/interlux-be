import {
    Controller,
    Get,
    Param,
    Query,
    HttpStatus,
} from '@nestjs/common';
import { BlogClientService } from './blog.service';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiTags('Client - Blog')
@Controller('blog')
export class BlogClientController {
    constructor(private readonly blogClientService: BlogClientService) { }

    @ApiOperation({ summary: 'Get all published blog posts' })
    @Get()
    async findAll(
        @Query() { page = 1, limit = 10, search, tagId }: GetAllPostsDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.blogClientService.findAll(page, limit, search, tagId);
            return new ApiResponse(
                'Blog posts retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get blog post by slug' })
    @ApiParam({ name: 'slug', type: String })
    @Get(':slug')
    async findBySlug(
        @Param('slug') slug: string
    ): Promise<ApiResponse<any>> {
        try {
            const post = await this.blogClientService.findBySlug(slug);
            return new ApiResponse(
                'Blog post retrieved successfully',
                HttpStatus.OK,
                post
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get popular blog posts' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('popular/posts')
    async getPopularPosts(
        @Query('limit') limit?: number
    ): Promise<ApiResponse<any>> {
        try {
            const posts = await this.blogClientService.getPopularPosts(limit);
            return new ApiResponse(
                'Popular posts retrieved successfully',
                HttpStatus.OK,
                posts
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get recent blog posts' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get('recent/posts')
    async getRecentPosts(
        @Query('limit') limit?: number
    ): Promise<ApiResponse<any>> {
        try {
            const posts = await this.blogClientService.getRecentPosts(limit);
            return new ApiResponse(
                'Recent posts retrieved successfully',
                HttpStatus.OK,
                posts
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all tags' })
    @Get('tags/all')
    async getAllTags(): Promise<ApiResponse<any>> {
        try {
            const tags = await this.blogClientService.getAllTags();
            return new ApiResponse(
                'Tags retrieved successfully',
                HttpStatus.OK,
                tags
            );
        } catch (error) {
            return resError(error);
        }
    }
}
