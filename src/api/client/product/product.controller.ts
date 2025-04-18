import {
    Controller,
    Get,
    Param,
    Query,
    HttpStatus,
    UseInterceptors,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ProductClientService } from './product.service';
import { FindAllProductsClientDto } from './dto';

@ApiTags('Product')
@Controller('product')
@UseInterceptors(CacheInterceptor)
export class ProductClientController {
    constructor(private readonly productClientService: ProductClientService) { }

    @Get()
    async findAll(
        @Query() findAllProductsClientDto: FindAllProductsClientDto,
    ): Promise<ApiResponse<any>> {
        try {
            const {
                page,
                limit,
                categoryId,
                search,
                sortBy,
                sortDirection,
                minPrice,
                maxPrice,
                attributes,
            } = findAllProductsClientDto;

            const result = await this.productClientService.findAll({
                page,
                limit,
                categoryId,
                search,
                sortBy,
                sortDirection,
                minPrice,
                maxPrice,
                attributes,
            });

            return new ApiResponse(
                'Products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('featured')
    async getFeaturedProducts(): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getFeaturedProducts();
            console.log('aaaaaaaaaaaaaaaaa');
            return new ApiResponse(
                'Featured products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            console.error('Error when fetching featured products:', error);
            return resError(error);
        }
    }

    @Get('bestsellers')
    async getBestSellingProducts(): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getBestSellingProducts();

            return new ApiResponse(
                'Best selling products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('new-arrivals')
    async getNewArrivals(): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getNewArrivals();

            return new ApiResponse(
                'New arrival products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('related/:id')
    async getRelatedProducts(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getRelatedProducts(id);

            return new ApiResponse(
                'Related products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('detail/:slug')
    async findBySlug(@Param('slug') slug: string): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.findBySlug(slug);

            return new ApiResponse(
                'Product details retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('category/:slug')
    async getProductsByCategory(
        @Param('slug') slug: string,
        @Query() findAllProductsClientDto: FindAllProductsClientDto,
    ): Promise<ApiResponse<any>> {
        try {
            const {
                page,
                limit,
                search,
                sortBy,
                sortDirection,
                minPrice,
                maxPrice,
                attributes,
            } = findAllProductsClientDto;

            const result = await this.productClientService.getProductsByCategory(
                slug,
                {
                    page,
                    limit,
                    search,
                    sortBy,
                    sortDirection,
                    minPrice,
                    maxPrice,
                    attributes,
                },
            );

            return new ApiResponse(
                'Category products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('variations/:productId')
    async getProductVariations(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getProductVariations(productId);

            return new ApiResponse(
                'Product variations retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('variation/:sku')
    async getVariationBySku(
        @Param('sku') sku: string,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getVariationBySku(sku);

            return new ApiResponse(
                'Product variation retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }

    @Get('filters/:categorySlug')
    async getAvailableFilters(
        @Param('categorySlug') categorySlug: string,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productClientService.getAvailableFilters(categorySlug);

            return new ApiResponse(
                'Available filters retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
        }
    }
}