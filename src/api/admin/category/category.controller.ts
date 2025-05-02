import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { GetAllCategoryDto } from './dto/get-all-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Admin - Category')
@Controller('category')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @ApiOperation({ summary: 'Get all categories' })
    @Get()
    async findAll(
        @Query() {page = 1, limit = 10, parentId}: GetAllCategoryDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryService.findAll(page, limit, parentId);
            return new ApiResponse(
                'Categories retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get category by ID' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            const category = await this.categoryService.findOne(id);
            return new ApiResponse(
                'Category retrieved successfully',
                HttpStatus.OK,
                category
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get category by slug' })
    @ApiParam({ name: 'slug', type: String })
    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string): Promise<ApiResponse<any>> {
        try {
            const category = await this.categoryService.findBySlug(slug);
            return new ApiResponse(
                'Category retrieved successfully',
                HttpStatus.OK,
                category
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Create new category' })
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponse<any>> {
        try {
            const category = await this.categoryService.create(createCategoryDto);
            return new ApiResponse(
                'Category created successfully',
                HttpStatus.CREATED,
                category
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Update category' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto
    ): Promise<ApiResponse<any>> {
        try {
            const category = await this.categoryService.update(id, updateCategoryDto);
            return new ApiResponse(
                'Category updated successfully',
                HttpStatus.OK,
                category
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Delete category' })
    @ApiParam({ name: 'id', type: Number })
    @SwaggerResponse({ status: 200, description: 'Category deleted successfully' })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            await this.categoryService.remove(id);
            return new ApiResponse(
                'Category deleted successfully',
                HttpStatus.OK
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}