import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommonStatus } from '@prisma/client';

export class GetAllCouponDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiProperty({
        required: false,
        enum: CommonStatus,
        description: 'Filter by status'
    })
    @IsOptional()
    @IsEnum(CommonStatus)
    status?: CommonStatus;
}