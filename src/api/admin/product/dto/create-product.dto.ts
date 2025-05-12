import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import {
    IsString,
    IsOptional,
    IsNumber,
    IsInt,
    IsEnum,
    Min,
    Max,
    IsObject
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ description: 'Product title' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Price' })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @ApiPropertyOptional({ description: 'Percent off' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiPropertyOptional({ description: 'Attributes as JSON' })
    @IsObject()
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    attributes?: object;

    @ApiProperty({ description: 'Category ID' })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    categoryId: number;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Product status',
        enum: ProductStatus,
        default: ProductStatus.DRAFT,
    })
    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @ApiProperty({
        description: "Images of the product",
        type: [String],
        format: "binary",
        required: true,
    })
    images: string[];

    @ApiPropertyOptional({
        description: "3D model file (supports .glb or .gltf format)",
        type: String,
        format: "binary",
        required: false,
    })
    model3d?: string;
}