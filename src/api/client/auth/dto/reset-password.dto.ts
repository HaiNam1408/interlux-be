import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        description: "Email",
        example: "john_doe@gmail.com",
    })
    @IsEmail({}, { message: "Email not valid." })
    email: string;

    @ApiProperty({
        description: "Reset Password Token",
        example: "ABC123",
    })
    @IsString({ message: "Token must be a string." })
    token: string;

    @ApiProperty({
        description: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        example: "StrongPass123",
    })
    @IsString({ message: "Password must be a string." })
    @IsNotEmpty({ message: "Password is required." })
    @MinLength(8, { message: "Password must be at least 8 characters long." })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    })
    newPassword: string;
}
