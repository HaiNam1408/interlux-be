import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    HttpStatus,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductVariationDto, UpdateProductVariationDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Admin - Product Variation')
@Controller('product/:productId/variation')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ProductVariationController {
    constructor(private readonly productVariationService: ProductVariationService) { }

    @ApiOperation({ summary: 'Create product variation' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Create Product Variation",
        type: CreateProductVariationDto,
    })
    @UseInterceptors(FilesInterceptor("images", 6))
    @Post()
    async create(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() createProductVariationDto: CreateProductVariationDto,
        @UploadedFiles() images: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productVariationService.create(
                productId,
                createProductVariationDto,
                images || [],
            );
            return new ApiResponse(
                'Product variation created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all product variations' })
    @Get()
    async findAll(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productVariationService.findAll(productId);
            return new ApiResponse(
                'Product variations retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get product variation by ID' })
    @Get(':id')
    async findOne(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productVariationService.findOne(productId, id);
            return new ApiResponse(
                'Product variation retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update product variation' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Update Product Variation",
        type: UpdateProductVariationDto,
    })
    @UseInterceptors(FilesInterceptor("images", 6))
    @Patch(':id')
    async update(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductVariationDto: UpdateProductVariationDto,
        @UploadedFiles() images: Express.Multer.File[],
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productVariationService.update(
                productId,
                id,
                updateProductVariationDto,
                images || [],
            );
            return new ApiResponse(
                'Product variation updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete product variation' })
    @Delete(':id')
    async remove(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            await this.productVariationService.remove(productId, id);
            return new ApiResponse(
                'Product variation deleted successfully',
                HttpStatus.OK,
            );
        } catch (error) {
            resError(error);
        }
    }
}
