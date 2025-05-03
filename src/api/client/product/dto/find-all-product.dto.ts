import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsInt,
    IsNumber,
    Min,
    IsEnum,
    IsJSON,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllProductsClientDto {
    @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Transform(({ value }) => (value ? parseInt(value) : 1))
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Số lượng sản phẩm mỗi trang', default: 10 })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Transform(({ value }) => (value ? parseInt(value) : 10))
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'ID danh mục sản phẩm' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value) : undefined))
    categoryId?: number;

    @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
        description: 'Sắp xếp theo trường',
        default: 'createdAt',
        enum: ['createdAt', 'price', 'sold']
    })
    @IsString()
    @IsOptional()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({
        description: 'Hướng sắp xếp',
        default: 'desc',
        enum: ['asc', 'desc']
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sortDirection?: 'asc' | 'desc' = 'desc';

    @ApiPropertyOptional({ description: 'Giá tối thiểu' })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Giá tối đa' })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => (value ? parseFloat(value) : undefined))
    maxPrice?: number;

    @ApiPropertyOptional({
        description: 'Lọc theo thuộc tính dạng JSON, ví dụ: {"color":"red","size":"M"}'
    })
    @IsJSON()
    @IsOptional()
    attributes?: string;
}