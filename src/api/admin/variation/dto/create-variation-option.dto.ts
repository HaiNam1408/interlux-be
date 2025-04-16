import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVariationOptionDto {
    @ApiProperty({ description: 'Variation option name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Variation option value' })
    @IsString()
    @IsOptional()
    value?: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Option status',
        enum: CommonStatus,
        default: CommonStatus.ACTIVE,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;
}