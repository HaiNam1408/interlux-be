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
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    CreateProductAttributeDto,
    UpdateProductAttributeDto,
    CreateProductAttributeValueDto,
    UpdateProductAttributeValueDto
} from './dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiBearerAuth()
@ApiTags('Admin - Product Attribute')
@Controller('product/:productId/attribute')
export class ProductAttributeController {
    constructor(private readonly productAttributeService: ProductAttributeService) { }

    @ApiOperation({ summary: 'Create product attribute' })
    @Post()
    async create(
        @Param('productId', ParseIntPipe) productId: number,
        @Body() createProductAttributeDto: CreateProductAttributeDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.create(productId, createProductAttributeDto);
            return new ApiResponse(
                'Product attribute created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all product attributes' })
    @Get()
    async findAll(
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.findAll(productId);
            return new ApiResponse(
                'Product attributes retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get product attribute by ID' })
    @Get(':id')
    async findOne(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.findOne(productId, id);
            return new ApiResponse(
                'Product attribute retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update product attribute' })
    @Patch(':id')
    async update(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductAttributeDto: UpdateProductAttributeDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.update(
                productId,
                id,
                updateProductAttributeDto,
            );
            return new ApiResponse(
                'Product attribute updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete product attribute' })
    @Delete(':id')
    async remove(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            await this.productAttributeService.remove(productId, id);
            return new ApiResponse(
                'Product attribute deleted successfully',
                HttpStatus.OK,
            );
        } catch (error) {
            resError(error);
        }
    }

    // Attribute Value endpoints
    @ApiOperation({ summary: 'Create attribute value' })
    @Post(':attributeId/value')
    async createValue(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('attributeId', ParseIntPipe) attributeId: number,
        @Body() createProductAttributeValueDto: CreateProductAttributeValueDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.createValue(
                productId,
                attributeId,
                createProductAttributeValueDto,
            );
            return new ApiResponse(
                'Attribute value created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all attribute values' })
    @Get(':attributeId/value')
    async findAllValues(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('attributeId', ParseIntPipe) attributeId: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.findAllValues(
                productId,
                attributeId,
            );
            return new ApiResponse(
                'Attribute values retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update attribute value' })
    @Patch(':attributeId/value/:valueId')
    async updateValue(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('attributeId', ParseIntPipe) attributeId: number,
        @Param('valueId', ParseIntPipe) valueId: number,
        @Body() updateProductAttributeValueDto: UpdateProductAttributeValueDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.productAttributeService.updateValue(
                productId,
                attributeId,
                valueId,
                updateProductAttributeValueDto,
            );
            return new ApiResponse(
                'Attribute value updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete attribute value' })
    @Delete(':attributeId/value/:valueId')
    async removeValue(
        @Param('productId', ParseIntPipe) productId: number,
        @Param('attributeId', ParseIntPipe) attributeId: number,
        @Param('valueId', ParseIntPipe) valueId: number,
    ): Promise<ApiResponse<any>> {
        try {
            await this.productAttributeService.removeValue(
                productId,
                attributeId,
                valueId,
            );
            return new ApiResponse(
                'Attribute value deleted successfully',
                HttpStatus.OK,
            );
        } catch (error) {
            resError(error);
        }
    }
}
