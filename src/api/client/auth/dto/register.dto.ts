import {
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    IsNotEmpty,
    Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        description: "Username (only letters, numbers, and underscores, max 20 characters).",
        example: "john_doe",
    })
    @IsString({ message: "Username must be a string." })
    @IsNotEmpty({ message: "Username is required." })
    @MaxLength(20, { message: "Username must be at most 20 characters long." })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." })
    username: string;

    @ApiProperty({
        description: "A valid email address.",
        example: "example@gmail.com",
    })
    @IsEmail({}, { message: "Invalid email format." })
    @IsNotEmpty({ message: "Email is required." })
    email: string;

    @ApiProperty({
        description: "A valid phone number.",
        example: "0987654321",
    })
    @IsString({ message: "Phone must be a string." })
    @IsNotEmpty({ message: "Phone number is required." })
    phone: string;

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
    password: string;
}
