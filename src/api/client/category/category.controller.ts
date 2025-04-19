import {
    Controller,
    Get,
    Param,
    Query,
    HttpStatus,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CategoryClientService } from './category.service';
import { FindCategoriesClientDto } from './dto';

@ApiTags('Category')
@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryClientController {
    constructor(private readonly categoryClientService: CategoryClientService) { }

    @ApiOperation({ summary: 'Get category menu list' })
    @Get()
    async getCategoryMenu(): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryClientService.getCategoryMenu();

            return new ApiResponse(
                'Category menu retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get featured categories' })
    @Get('featured')
    async getFeaturedCategories(): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryClientService.getFeaturedCategories();

            return new ApiResponse(
                'Featured categories retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get category details by slug' })
    @Get(':slug')
    async findBySlug(@Param('slug') slug: string): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryClientService.findBySlug(slug);

            return new ApiResponse(
                'Category details retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get subcategories by parent slug' })
    @Get(':slug/subcategories')
    async getSubcategories(@Param('slug') slug: string): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryClientService.getSubcategories(slug);

            return new ApiResponse(
                'Subcategories retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get category breadcrumb by slug' })
    @Get(':slug/breadcrumb')
    async getCategoryBreadcrumb(@Param('slug') slug: string): Promise<ApiResponse<any>> {
        try {
            const result = await this.categoryClientService.getCategoryBreadcrumb(slug);

            return new ApiResponse(
                'Category breadcrumb retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }
}