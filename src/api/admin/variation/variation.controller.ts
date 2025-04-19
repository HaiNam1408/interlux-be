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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVariationDto, FindAllVariationsDto, UpdateVariationDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';

@ApiBearerAuth()
@ApiTags('variation')
@Controller('variation')
export class VariationController {
    constructor(private readonly variationService: VariationService) { }

    @ApiOperation({ summary: 'Create variation' })
    @Post()
    async create(@Body() createVariationDto: CreateVariationDto): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.create(createVariationDto);
            return new ApiResponse(
                'Variation created successfully',
                HttpStatus.CREATED,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all variations' })
    @Get()
    async findAll(@Query() findAllVariationsDto: FindAllVariationsDto): Promise<ApiResponse<any>> {
        try {
            const { page, limit, status, search } = findAllVariationsDto;
            const result = await this.variationService.findAll(
                page,
                limit,
                status,
                search,
            );
            return new ApiResponse(
                'Variations retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Get variation by ID' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.findOne(id);
            return new ApiResponse(
                'Variation retrieved successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Update variation' })
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateVariationDto: UpdateVariationDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.variationService.update(id, updateVariationDto);
            return new ApiResponse(
                'Variation updated successfully',
                HttpStatus.OK,
                result,
            );
        } catch (error) {
            resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete variation' })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            await this.variationService.remove(id);
            return new ApiResponse(
                'Variation deleted successfully',
                HttpStatus.OK,
                null,
            );
        } catch (error) {
            resError(error);
        }
    }
}