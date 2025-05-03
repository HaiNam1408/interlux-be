import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
    @ApiProperty({
        description: 'Mã giảm giá cần kiểm tra',
        example: 'SUMMER10',
    })
    @IsString()
    @IsNotEmpty()
    code: string;
}