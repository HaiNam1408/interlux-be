import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send the notification to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Notification title',
    example: 'Order Confirmed',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Notification content',
    example: 'Your order #12345 has been confirmed and is being processed.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.ORDER,
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Related entity ID (e.g., order ID, product ID)',
    example: 12345,
  })
  @IsInt()
  @IsOptional()
  relatedId?: number;

  @ApiPropertyOptional({
    description: 'Related entity type (e.g., Order, Product)',
    example: 'Order',
  })
  @IsString()
  @IsOptional()
  relatedType?: string;
}
