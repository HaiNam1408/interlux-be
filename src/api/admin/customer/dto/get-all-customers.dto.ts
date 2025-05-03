import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';

export class GetAllCustomersDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiProperty({
    description: 'Search by username, phone or email',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
