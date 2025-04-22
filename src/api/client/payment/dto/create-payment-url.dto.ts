import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export enum PaymentMethodEnum {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
  PAYPAL = 'PAYPAL',
  COD = 'COD',
}

export class CreatePaymentUrlDto {
  @ApiProperty({
    description: 'Order ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.VNPAY,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;
}
