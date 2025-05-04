import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@prisma/client';

export class GetAllOrdersDto {
  @ApiPropertyOptional({
    description: 'Page number (starts from 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Transform(({ value }) => (value ? parseInt(value) : 1))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Transform(({ value }) => (value ? parseInt(value) : 10))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by order status',
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status' })
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Search by order number or customer information',
    example: 'ORD123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by customer ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Customer ID must be an integer' })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  userId?: number;
}
