import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.ressponse';

@ApiBearerAuth()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<any> {
        try {
            await this.authService.register(dto);
            return new ApiResponse<any>("Please check your email to verify", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const data = await this.authService.login(dto);
            return new ApiResponse<any>("User login successfully", HttpStatus.OK, data);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        try {
            return await this.authService.verifyEmail(token);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('refresh')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        try {
            const data = await this.authService.refreshToken(dto.refreshToken);
            return new ApiResponse<any>("Refresh token successfully", HttpStatus.OK, data);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('reset-refresh-token')
    async resetRefreshToken(@Body() userId: number) {
        try {
            await this.authService.resetRefreshToken(userId);
            return new ApiResponse<any>("Refresh token has been reset", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
