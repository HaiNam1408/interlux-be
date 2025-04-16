import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
    @ApiProperty({
        description: 'Tên người nhận',
        example: 'Nguyễn Văn A',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        description: 'Số điện thoại',
        example: '0987654321',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'Email',
        example: 'example@email.com',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Địa chỉ chi tiết',
        example: 'Số 123, Đường ABC',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Quận/Huyện',
        example: 'Quận 1',
    })
    @IsString()
    @IsNotEmpty()
    district: string;

    @ApiProperty({
        description: 'Tỉnh/Thành phố',
        example: 'TP Hồ Chí Minh',
    })
    @IsString()
    @IsNotEmpty()
    province: string;

    @ApiProperty({
        description: 'Ghi chú',
        example: 'Giao hàng giờ hành chính',
        required: false,
    })
    @IsString()
    @IsOptional()
    note?: string;
}