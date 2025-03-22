import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: "Email.",
        example: "john_doe@gmail.com",
    })
    @IsString({ message: "Email phải là chuỗi." })
    @IsNotEmpty({ message: "Email không được để trống." })
    email: string;

    @ApiProperty({
        description: "Mật khẩu của tài khoản.",
        example: "********",
    })
    @IsString({ message: "Password phải là chuỗi." })
    @IsNotEmpty({ message: "Password không được để trống." })
    password: string;
}
