import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({
        description: "Email.",
        example: "john_doe@gmail.com",
    })
    @IsEmail({}, { message: "Email not valid." })
    email: string;
}
