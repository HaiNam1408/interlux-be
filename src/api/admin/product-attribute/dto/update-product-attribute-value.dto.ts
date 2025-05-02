import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductAttributeValueDto {
    @ApiPropertyOptional({ description: 'Attribute value name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Attribute value' })
    @IsString()
    @IsOptional()
    value?: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Value status',
        enum: CommonStatus,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;
}
