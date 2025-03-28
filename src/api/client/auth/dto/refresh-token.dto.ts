import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({
        description: "Refresh token valid.",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString({ message: "Refresh Token must be a string." })
    @IsNotEmpty({ message: "Refresh Token must not be empty." })
    refreshToken: string;
}
