import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Username (only letters, numbers, and underscores, max 20 characters)',
    example: 'john_doe',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '0987654321',
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({
    description: 'Password',
    example: 'Password123!',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main St, City',
    required: false,
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'User avatar',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '') return null;
    return value;
  })
  avatar?: string;
}
