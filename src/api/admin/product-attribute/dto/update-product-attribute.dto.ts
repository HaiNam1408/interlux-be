import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductAttributeDto {
    @ApiPropertyOptional({ description: 'Attribute name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Attribute status',
        enum: CommonStatus,
    })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;
}
