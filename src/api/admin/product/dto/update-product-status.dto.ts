import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateProductStatusDto {
    @ApiProperty({
        description: 'Trạng thái sản phẩm',
        enum: ProductStatus,
    })
    @IsEnum(ProductStatus)
    status: ProductStatus;
}