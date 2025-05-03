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
    @ApiProperty({ description: 'Tên sản phẩm' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Mô tả sản phẩm' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Giá sản phẩm' })
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @ApiPropertyOptional({ description: 'Phần trăm giảm giá' })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    percentOff?: number;

    @ApiPropertyOptional({ description: 'Thuộc tính sản phẩm dạng JSON' })
    @IsObject()
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    attributes?: object;

    @ApiProperty({ description: 'ID danh mục' })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    categoryId: number;

    @ApiPropertyOptional({ description: 'Thứ tự sắp xếp' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    sort?: number;

    @ApiPropertyOptional({
        description: 'Trạng thái sản phẩm',
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
}