import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.ressponse';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiBearerAuth()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('test-redis')
    async test(): Promise<any> {
        try {
            let abc = await this.authService.test();
            return {
                message: abc
            }
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseInterceptors(CacheInterceptor)
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
    async verifyEmail(@Query('token') token: string, @Query('email') email: string) {
        try {
            await this.authService.verifyEmail(token, email);
            return new ApiResponse<any>("User register successfully", HttpStatus.OK);
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
