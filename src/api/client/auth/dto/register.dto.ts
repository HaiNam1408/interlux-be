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
        description: "Tên đăng nhập (không chứa ký tự đặc biệt, tối đa 20 ký tự).",
        example: "john_doe",
    })
    @IsString({ message: "Username phải là chuỗi." })
    @IsNotEmpty({ message: "Username không được để trống." })
    @MaxLength(20, { message: "Username tối đa 20 ký tự." })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username chỉ chứa chữ, số và dấu gạch dưới." })
    username: string;

    @ApiProperty({
        description: "Email hợp lệ của người dùng.",
        example: "example@gmail.com",
    })
    @IsEmail({}, { message: "Email không hợp lệ." })
    @IsNotEmpty({ message: "Email không được để trống." })
    email: string;

    @ApiProperty({
        description: "Số điện thoại hợp lệ.",
        example: "0987654321",
    })
    @IsString({ message: "Phone phải là chuỗi." })
    @IsNotEmpty({ message: "Phone không được để trống." })
    phone: string;

    @ApiProperty({
        description: "Mật khẩu có ít nhất 6 ký tự.",
        example: "StrongPass123",
    })
    @IsString({ message: "Password phải là chuỗi." })
    @IsNotEmpty({ message: "Password không được để trống." })
    @MinLength(6, { message: "Password phải có ít nhất 6 ký tự." })
    password: string;
}
