import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({
        description: "Refresh token hợp lệ.",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString({ message: "Refresh Token phải là chuỗi." })
    @IsNotEmpty({ message: "Refresh Token không được để trống." })
    refreshToken: string;
}
