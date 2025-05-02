import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFiles,
    Query,
    UseInterceptors,
    ParseIntPipe,
    HttpException,
    HttpStatus,
    Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiBearerAuth()
@ApiTags('Admin - Product')
@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) { }


    @ApiOperation({ summary: 'Create a new product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Create Product",
        type: CreateProductDto,
    })
    @UseInterceptors(FilesInterceptor("images", 6))
    @Post()
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() product_images: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            if (!product_images || product_images.length === 0) {
                throw new HttpException('Images are required!', HttpStatus.BAD_REQUEST);
            }

            const result = await this.productService.create(
                createProductDto,
                product_images,
            );

            return new ApiResponse<{}>(
                'Product created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }


    @ApiOperation({ summary: 'Get all products' })
    @Get()
    async findAll(@Query() findAllProductsDto: FindAllProductsDto): Promise<ApiResponse<any>> {
        try {
            const { page, limit, status, categoryId, search, includeInactive } = findAllProductsDto;

            const result = await this.productService.findAll(
                page,
                limit,
                status,
                categoryId,
                search,
                includeInactive
            );

            return new ApiResponse(
                'Products retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get product by ID' })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productService.findOne(id);

            return new ApiResponse(
                'Product retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Update Product For Admin",
        type: UpdateProductDto,
        required: false,
    })
    @UseInterceptors(FilesInterceptor("images", 6))
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() images?: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productService.update(
                id,
                updateProductDto,
                images
            );

            return new ApiResponse(
                'Product updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update product status' })
    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductStatusDto: UpdateProductStatusDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productService.updateStatus(
                id,
                updateProductStatusDto.status,
            );

            return new ApiResponse(
                'Product status updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete product' })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            await this.productService.remove(id);

            return new ApiResponse<{}>(
                'Product deleted successfully',
                HttpStatus.OK,
            );
        } catch (error) {
            resError(error);
        }
    }
}