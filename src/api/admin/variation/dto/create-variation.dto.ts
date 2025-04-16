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
import { CreateVariationOptionDto } from './create-variation-option.dto';

export class CreateVariationDto {
    @ApiProperty({ description: 'Variation name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Variation status',
        enum: CommonStatus,
        default: CommonStatus.ACTIVE,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;

    @ApiProperty({ description: 'Variation options', type: [CreateVariationOptionDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateVariationOptionDto)
    options: CreateVariationOptionDto[];
}