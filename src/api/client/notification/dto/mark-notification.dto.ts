import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class MarkNotificationDto {
  @ApiProperty({
    description: 'Notification ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
