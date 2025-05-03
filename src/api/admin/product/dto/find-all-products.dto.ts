import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllProductsDto {
    @ApiPropertyOptional({ description: 'Số trang', default: 1 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : 1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Số lượng mỗi trang', default: 10 })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : 10)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Trạng thái sản phẩm',
        enum: ProductStatus,
    })
    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @ApiPropertyOptional({ description: 'ID danh mục' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Tìm kiếm theo tên hoặc mô tả' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        description: 'Include inactive (deleted) products',
        default: false
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    includeInactive?: boolean = false;
}