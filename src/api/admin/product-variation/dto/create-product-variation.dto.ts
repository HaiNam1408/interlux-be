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
import { CreateProductVariationValueDto } from './create-product-variation-value.dto';

export class CreateProductVariationDto {
    @ApiProperty({ description: 'SKU product variation' })
    @IsString()
    sku: string;

    @ApiPropertyOptional({ description: 'Price product variation' })
    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
    price?: number;

    @ApiPropertyOptional({ description: 'Percent off product variation' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiPropertyOptional({ description: 'Inventory product variation' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    inventory?: number = 0;

    @ApiPropertyOptional({ description: 'Default product variation', default: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    isDefault?: boolean = false;

    @ApiPropertyOptional({
        description: 'Status product variation',
        enum: CommonStatus,
        default: CommonStatus.ACTIVE,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;

    @ApiProperty({ description: 'Attribute values for this variation', type: [CreateProductVariationValueDto] })
    @Transform(({ value }) => value.map((id) => (Number(id))))
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => CreateProductVariationValueDto)
    attributeValues: number[];
}
