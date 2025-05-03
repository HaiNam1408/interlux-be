import { IsString, IsOptional, IsInt, MinLength, IsNotEmpty, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 100, description: 'Sort order (lower values appear first)', required: false })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiProperty({ example: 1, description: 'Parent category ID', required: false })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    parentId?: number;

    @ApiProperty({
        type: String,
        required: false,
        description: 'Category image',
        format: "binary",
    })
    @IsOptional()
    image?: string;
}