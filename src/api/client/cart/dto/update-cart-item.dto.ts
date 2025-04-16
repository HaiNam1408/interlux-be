import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
    @ApiProperty({
        description: 'ID của mục trong giỏ hàng',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    cartItemId: number;

    @ApiProperty({
        description: 'Số lượng mới của sản phẩm',
        example: 2,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}