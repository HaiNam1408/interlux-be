import { IsString, IsOptional, IsInt, MinLength, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 100, description: 'Sort order (lower values appear first)', required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    sort?: number;

    @ApiProperty({ example: 1, description: 'Parent category ID', required: false })
    @IsOptional()
    @IsInt()
    parentId?: number;
}