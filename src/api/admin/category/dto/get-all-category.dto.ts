import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetAllCategoryDto {
    @Transform(({ value }) => (value ? Number(value) : 1))
    @ApiProperty({ example: 1, description: 'Page number', required: false })
    @IsOptional()
    @IsInt()
    page: number = 1;

    @Transform(({ value }) => (value ? Number(value) : 1))
    @ApiProperty({ example: 10, description: 'Number of items per page', required: false })
    @IsOptional()
    @IsInt()
    limit: number = 10;

    @Transform(({ value }) => (value ? Number(value) : 1))
    @ApiProperty({ description: 'Parent category ID', required: false })
    @IsOptional()
    @IsInt()
    parentId?: number;
}