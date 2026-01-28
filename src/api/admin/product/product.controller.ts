import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFiles,
    UploadedFile,
    Query,
    UseInterceptors,
    ParseIntPipe,
    HttpException,
    HttpStatus,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Admin - Product')
@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
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
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            const images = files.filter(file => file.fieldname === 'images');
            const model3d = files.find(file => file.fieldname === 'model3d');
            if (!images || images.length === 0) {
                throw new HttpException('Images are required!', HttpStatus.BAD_REQUEST);
            }

            const result = await this.productService.create(
                createProductDto,
                images,
                model3d,
            );

            return new ApiResponse<{}>(
                'Product created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            return resError(error);
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
    @UseInterceptors(AnyFilesInterceptor())
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() files: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            const images = files.filter(file => file.fieldname === 'images');
            const model3d = files.find(file => file.fieldname === 'model3d');
            
            const result = await this.productService.update(
                id,
                updateProductDto,
                images,
                model3d
            );

            return new ApiResponse(
                'Product updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            return resError(error);
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