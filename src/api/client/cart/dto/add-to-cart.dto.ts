import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty({
        description: 'ID của sản phẩm',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    productId: number;

    @ApiProperty({
        description: 'ID của biến thể sản phẩm (nếu có)',
        example: 2,
        required: false,
    })
    @IsInt()
    @IsOptional()
    productVariationId?: number;

    @ApiProperty({
        description: 'Số lượng sản phẩm',
        example: 1,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}