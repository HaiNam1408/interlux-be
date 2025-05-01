import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
    IsArray,
    ValidateNested,
    ArrayMinSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateProductVariationOptionDto } from './create-product-variation-option.dto';

export class CreateProductVariationDto {
    @ApiProperty({ description: 'SKU product variation' })
    @IsString()
    sku: string;

    @ApiPropertyOptional({ description: 'price product variation' })
    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
    price?: number;

    @ApiPropertyOptional({ description: 'percent off product variation' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiPropertyOptional({ description: 'inventory product variation' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    inventory?: number = 0;

    @ApiPropertyOptional({ description: 'default product variation', default: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isDefault?: boolean = false;

    @ApiPropertyOptional({
        description: 'status product variation',
        enum: CommonStatus,
        default: CommonStatus.ACTIVE,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;

    @ApiProperty({ description: 'option product variation', type: [CreateProductVariationOptionDto] })
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateProductVariationOptionDto)
    options: CreateProductVariationOptionDto[];
}