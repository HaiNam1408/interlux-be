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
import { CreateProductAttributeValueDto } from './create-product-attribute-value.dto';

export class CreateProductAttributeDto {
    @ApiProperty({ description: 'Attribute name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Attribute status',
        enum: CommonStatus,
        default: CommonStatus.ACTIVE,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;

    @ApiProperty({ description: 'Attribute values', type: [CreateProductAttributeValueDto] })
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @IsOptional()
    @Type(() => CreateProductAttributeValueDto)
    values: CreateProductAttributeValueDto[];
}
