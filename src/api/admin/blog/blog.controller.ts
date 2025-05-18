import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetAllPostsDto } from './dto/get-all-posts.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Admin - Blog')
@Controller('blog')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @ApiOperation({ summary: 'Get all blog posts' })
    @Get()
    async findAll(
        @Query() { page = 1, limit = 10, status, search, tagId }: GetAllPostsDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.blogService.findAll(page, limit, status, search, tagId);
            return new ApiResponse(
                'Blog posts retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get blog post by ID' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            const post = await this.blogService.findOne(id);
            return new ApiResponse(
                'Blog post retrieved successfully',
                HttpStatus.OK,
                post
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get blog post by slug' })
    @ApiParam({ name: 'slug', type: String })
    @Get('slug/:slug')
    async findBySlug(
        @Param('slug') slug: string
    ): Promise<ApiResponse<any>> {
        try {
            const post = await this.blogService.findBySlug(slug);
            return new ApiResponse(
                'Blog post retrieved successfully',
                HttpStatus.OK,
                post
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Create a new blog post' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Create Blog Post",
        type: CreatePostDto,
    })
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail'))
    async create(
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() thumbnail?: Express.Multer.File
    ): Promise<ApiResponse<any>> {
        try {
            const post = await this.blogService.create(createPostDto, thumbnail);
            return new ApiResponse(
                'Blog post created successfully',
                HttpStatus.CREATED,
                post
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Update blog post' })
    @ApiParam({ name: 'id', type: Number })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Update Blog Post",
        type: UpdatePostDto,
    })
    @Patch(':id')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePostDto: UpdatePostDto,
        @UploadedFile() thumbnail?: Express.Multer.File
    ): Promise<ApiResponse<any>> {
        try {
            const post = await this.blogService.update(id, updatePostDto, thumbnail);
            return new ApiResponse(
                'Blog post updated successfully',
                HttpStatus.OK,
                post
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete blog post' })
    @ApiParam({ name: 'id', type: Number })
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            await this.blogService.remove(id);
            return new ApiResponse(
                'Blog post deleted successfully',
                HttpStatus.OK,
                null
            );
        } catch (error) {
            return resError(error);
        }
    }
}
