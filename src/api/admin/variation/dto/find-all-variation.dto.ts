import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommonStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllVariationsDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value) || 1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => parseInt(value) || 10)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Variation status', enum: CommonStatus })
    @IsEnum(CommonStatus)
    @IsOptional()
    status?: CommonStatus;

    @ApiPropertyOptional({ description: 'Search by name' })
    @IsString()
    @IsOptional()
    search?: string;
}