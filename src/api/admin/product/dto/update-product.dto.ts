import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
    @ApiProperty({
        required: false,
        description: 'The title of the product',
        example: 'Premium Coffee Maker',
        type: String
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        required: false,
        description: 'Detailed description of the product',
        example: 'High-quality coffee maker with temperature control and timer.',
        type: String
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        required: false,
        description: 'The price of the product in your currency',
        example: 199,
        minimum: 0
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    price?: number;

    @ApiProperty({
        required: false,
        description: 'Discount percentage off the regular price',
        example: 15,
        minimum: 0,
        maximum: 100
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiProperty({
        required: false,
        description: 'Additional product attributes as a JSON object',
        example: {
            color: 'Black',
            dimensions: '10x8x14 inches',
            weight: '5 lbs',
            material: 'Stainless Steel'
        },
    })
    @IsOptional()
    attributes?: object;

    @ApiProperty({
        required: false,
        description: 'ID of the category this product belongs to',
        example: 5,
        type: Number
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    categoryId?: number;

    @ApiProperty({
        required: false,
        description: 'Sort order for display (lower numbers appear first)',
        example: 10,
        type: Number
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiProperty({
        required: false,
        description: 'Current status of the product',
        enum: ProductStatus,
        enumName: 'ProductStatus',
        example: ProductStatus.DRAFT
    })
    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @ApiProperty({
        required: false,
        description: 'JSON string array of image filenames or URLs to delete',
        example: [
            {
                "fileName": "image1.jpg",
                "url": "https://example.com/image1.jpg"
            },
            {
                "fileName": "image2.jpg",
                "url": "https://example.com/image2.jpg"
            }
        ],
    })
    @IsString()
    @IsOptional()
    imagesToDelete?: object[];

    @ApiProperty({
        required: false,
        description: "New product images to upload (supports multiple files)",
        type: 'array',
        items: {
            type: 'string',
            format: 'binary'
        },
        maxItems: 6
    })
    images?: any[];
}