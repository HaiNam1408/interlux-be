import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsOptional,
    IsInt,
    IsBoolean,
    Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FindCategoriesClientDto {
    @ApiPropertyOptional({
        description: 'ID danh mục cha (để trống để lấy danh mục gốc)'
    })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value === '' || value === undefined ? null : parseInt(value))
    parentId?: number | null;

    @ApiPropertyOptional({
        description: 'Số lượng sản phẩm tối đa cho mỗi danh mục',
        default: 4
    })
    @IsInt()
    @IsOptional()
    @Min(0)
    @Transform(({ value }) => value ? parseInt(value) : 4)
    productLimit?: number = 4;
}