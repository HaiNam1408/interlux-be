import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductVariationDto {
    @ApiPropertyOptional({ description: 'Product SKU' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({ description: 'Product variation price' })
    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
    price?: number;

    @ApiPropertyOptional({ description: 'Discount percentage' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiPropertyOptional({ description: 'Inventory quantity' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    inventory?: number;

    @ApiPropertyOptional({ description: 'Is default variation' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isDefault?: boolean;

    @ApiPropertyOptional({
        description: 'Product variation status',
        enum: CommonStatus,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;
}