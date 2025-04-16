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
import { VariationService } from './variation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateVariationOptionDto, UpdateVariationOptionDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiBearerAuth()
@ApiTags('variation-option')
@Controller('variation/:variationId/option')
export class VariationOptionController {
    constructor(private readonly variationService: VariationService) { }

    @Post()
    async createOption(
        @Param('variationId', ParseIntPipe) variationId: number,
        @Body() createVariationOptionDto: CreateVariationOptionDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.createOption(variationId, createVariationOptionDto);
            return new ApiResponse(
                'Variation option created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @Get()
    async findAllOptions(
        @Param('variationId', ParseIntPipe) variationId: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.findAllOptions(variationId);
            return new ApiResponse(
                'Variation options retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @Get(':id')
    async findOneOption(
        @Param('variationId', ParseIntPipe) variationId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.findOneOption(variationId, id);
            return new ApiResponse(
                'Variation option retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @Patch(':id')
    async updateOption(
        @Param('variationId', ParseIntPipe) variationId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVariationOptionDto: UpdateVariationOptionDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.updateOption(variationId, id, updateVariationOptionDto);
            return new ApiResponse(
                'Variation option updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @Delete(':id')
    async removeOption(
        @Param('variationId', ParseIntPipe) variationId: number,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApiResponse<any>> {
        try {
            await this.variationService.removeOption(variationId, id);
            return new ApiResponse(
                'Variation option deleted successfully',
                HttpStatus.OK,
                null,
            );
        } catch (error) {
            resError(error);
        }
    }
}