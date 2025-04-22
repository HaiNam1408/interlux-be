import { IsString, IsEnum, IsNumber, IsDate, IsOptional, IsNotEmpty, Min, MinLength, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CouponType, CommonStatus } from '@prisma/client';

export class CreateCouponDto {
    @ApiProperty({ example: 'SUMMER2025', description: 'Coupon code' })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    code: string;

    @ApiProperty({
        example: 'PERCENTAGE',
        enum: CouponType,
        description: 'Coupon type (PERCENTAGE or FIXED_AMOUNT)'
    })
    @IsEnum(CouponType)
    type: CouponType;

    @ApiProperty({ example: 15, description: 'Discount value (percentage or fixed amount)' })
    @IsNumber()
    @Min(0)
    value: number;

    @ApiProperty({ example: 100, description: 'Minimum purchase amount', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minPurchase?: number;

    @ApiProperty({ example: 100, description: 'Maximum usage count', required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsage?: number;

    @ApiProperty({ example: '2025-05-01T00:00:00Z', description: 'Start date' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2025-05-31T23:59:59Z', description: 'End date' })
    @IsDateString()
    endDate: string;

    @ApiProperty({
        example: 'ACTIVE',
        enum: CommonStatus,
        description: 'Coupon status',
        required: false
    })
    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}