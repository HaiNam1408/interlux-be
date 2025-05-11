import { IsString, IsNotEmpty, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: "Email.",
        example: "admin@gmail.com",
    })
    @IsString({ message: "Email must be a string." })
    @IsNotEmpty({ message: "Email is required." })
    email: string;

    @ApiProperty({
        description: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        example: "Abc123456",
    })
    @IsString({ message: "Password must be a string." })
    @IsNotEmpty({ message: "Password is required." })
    @MinLength(8, { message: "Password must be at least 8 characters long." })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    })
    password: string;
}
