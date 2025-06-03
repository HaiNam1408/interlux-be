import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class CreateOrderDto {
    @ApiProperty({
        description: 'Thông tin địa chỉ giao hàng',
        type: AddressDto,
    })
    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    shippingAddress: AddressDto;

    @ApiProperty({
        description: 'ID phương thức vận chuyển',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    shippingId: number;

    @ApiProperty({
        description: 'Phương thức thanh toán',
        example: 'BANK_TRANSFER',
    })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @ApiProperty({
        description: 'Mã giảm giá (nếu có)',
        example: 'SUMMER10',
        required: false,
    })
    @IsString()
    @IsOptional()
    couponCode?: string;

    @ApiProperty({
        description: 'Ghi chú đơn hàng',
        example: 'Giao trong giờ hành chính',
        required: false,
    })
    @IsString()
    @IsOptional()
    note?: string;
}
