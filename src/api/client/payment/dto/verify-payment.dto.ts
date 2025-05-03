import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
    @ApiProperty({
        description: 'ID của đơn hàng',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({
        description: 'ID giao dịch từ cổng thanh toán',
        example: 'TRANS123456789',
    })
    @IsString()
    @IsNotEmpty()
    transactionId: string;

    @ApiProperty({
        description: 'Metadata từ cổng thanh toán (có thể là chuỗi JSON)',
        example: '{}',
    })
    @IsString()
    @IsNotEmpty()
    metadata: string;
}